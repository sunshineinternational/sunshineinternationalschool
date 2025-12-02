import React from 'react';

const NoticeSkeleton: React.FC = () => {
    return (
        <div className="block bg-white p-3 rounded-md border border-[var(--color-border)]">
            <div className="flex justify-between items-center animate-pulse">
                <div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="flex items-center space-x-3 flex-shrink-0 ml-2">
                    <div className="w-8 h-4 bg-gray-200 rounded-full"></div>
                    <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
                </div>
            </div>
        </div>
    );
};

export default NoticeSkeleton;
