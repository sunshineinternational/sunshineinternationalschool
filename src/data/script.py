import pandas as pd
import json

def clean_val(val):
    """Safely converts cell values to numbers/strings. Returns 0 if empty."""
    if pd.isna(val) or str(val).strip() == "" or str(val).lower() == "nan":
        return 0
    try:
        # Extract numeric part (handles '80%', '79-A1', etc.)
        s = str(val).split('-')[0].replace('%', '').strip()
        return float(s)
    except ValueError:
        return str(val).strip()

def safe_get(df, row, col):
    """Prevents 'Index Out of Bounds' errors by checking sheet dimensions."""
    try:
        if row < len(df) and col < len(df.columns):
            return df.iloc[row, col]
        return None
    except:
        return None

def normalize_class_name(cls_name):
    """Standardizes Class names to Roman Numerals (I, II, III etc)."""
    cls_name = str(cls_name).upper().strip()
    mapping = {
        '1ST': 'I', 'FIRST': 'I', '1': 'I',
        '2ND': 'II', 'SECOND': 'II', '2': 'II',
        '3RD': 'III', 'THIRD': 'III', '3': 'III',
        '4TH': 'IV', 'FOURTH': 'IV', '4': 'IV',
        '5TH': 'V', 'FIFTH': 'V', '5': 'V',
        '6TH': 'VI', 'SIXTH': 'VI', '6': 'VI',
        '7TH': 'VII', 'SEVENTH': 'VII', '7': 'VII',
        '8TH': 'VIII', 'EIGHTH': 'VIII', '8': 'VIII'
    }
    return mapping.get(cls_name, cls_name)

def get_subject_name(name):
    """Decodes numeric subject codes back to meaningful names."""
    name_str = str(name).strip()
    name_map = {
        "10": "LANGUAGE",
        "9": "MATHEMATICS",
        "8": "E.V.S",
        "7": "RHYMES",
        "6": "DRAWING",
        "5": "ORAL",
        "4": "CRAFT"
    }
    return name_map.get(name_str, name_str)

def get_fixed_marks_and_grade(total_val, grade_val):
    """Detects and fixes 'flipped' data where marks/grades are in the wrong columns."""
    t = clean_val(total_val)
    g = str(grade_val).strip() if grade_val else ""

    # If Total is a Grade (like 'A1') and Grade is a Mark (like '100')
    if isinstance(t, str) and t in ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D', 'E']:
        actual_total = clean_val(g)
        actual_grade = t
        return actual_total, actual_grade
    
    # If Total is numeric and Grade exists, just return them
    return t, g

def process_school_excel(file_path, output_json='student_results.json'):
    print(f"Reading {file_path}...")
    xl = pd.ExcelFile(file_path)
    all_students = []

    for sheet_name in xl.sheet_names:
        print(f"Processing sheet: {sheet_name}")
        df = xl.parse(sheet_name, header=None)
        
        # Locate students by the 'STUDENT PROFILE' marker
        profile_indices = df[df[0].astype(str).str.contains("STUDENT PROFILE", na=False, case=False)].index.tolist()
        
        for start_idx in profile_indices:
            try:
                # 1. Extract Student Metadata
                name = str(safe_get(df, start_idx + 2, 0)).split(":")[-1].strip()
                roll = str(safe_get(df, start_idx + 4, 0)).split(":")[-1].strip()
                dob  = str(safe_get(df, start_idx + 3, 0)).split(":")[-1].strip()
                
                # Class detection
                current_class = normalize_class_name(sheet_name) 
                for r_class in range(max(0, start_idx-10), start_idx + 10):
                    header_val = str(safe_get(df, r_class, 15))
                    if "CLASS" in header_val:
                        raw_class = header_val.replace("CLASS - ", "").strip()
                        current_class = normalize_class_name(raw_class)
                        break

                student_obj = {
                    "class": current_class,
                    "roll_number": roll,
                    "name": name,
                    "dob": dob,
                    "subjects": []
                }

                # 2. Extract Marks for each Subject
                for r_offset in range(4, 30): # Scan further rows for large subjects
                    r = start_idx + r_offset
                    subject_label = safe_get(df, r, 4)
                    
                    if pd.isna(subject_label) or any(keyword in str(subject_label) for keyword in ["Co-Scholastic", "SUBJECT", "Place", "Date"]):
                        if len(student_obj["subjects"]) > 0: break 
                        continue
                    
                    # Term 1 Data Correction
                    t1_total, t1_grade = get_fixed_marks_and_grade(
                        safe_get(df, r, 9), 
                        safe_get(df, r, 10)
                    )
                    
                    # Term 2 Data Correction
                    t2_total, t2_grade = get_fixed_marks_and_grade(
                        safe_get(df, r, 15), 
                        safe_get(df, r, 16)
                    )

                    subj_data = {
                        "subject": get_subject_name(subject_label),
                        "term1": {
                            "pt": clean_val(safe_get(df, r, 5)),
                            "nb": clean_val(safe_get(df, r, 6)),
                            "se": clean_val(safe_get(df, r, 7)),
                            "te": clean_val(safe_get(df, r, 8)),
                            "total": t1_total,
                            "grade": t1_grade
                        },
                        "term2": {
                            "pt": clean_val(safe_get(df, r, 11)),
                            "nb": clean_val(safe_get(df, r, 12)),
                            "se": clean_val(safe_get(df, r, 13)),
                            "te": clean_val(safe_get(df, r, 14)),
                            "total": t2_total,
                            "grade": t2_grade
                        }
                    }
                    student_obj["subjects"].append(subj_data)

                all_students.append(student_obj)
            except Exception as e:
                print(f"Skipping student in {sheet_name} at row {start_idx}: {e}")

    # Final Output
    with open(output_json, 'w') as f:
        json.dump(all_students, f, indent=4)
    
    print(f"Success! Cleaned and Processed {len(all_students)} students.")

# --- Run the Script ---
# Ensure you have your .xlsx file in the same folder as this script
process_school_excel('ANNUAL EXAM TE 2 2025-26.xlsx')