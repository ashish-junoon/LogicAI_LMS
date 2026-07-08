import React from 'react'

const colorMap = {
    green: "bg-green-200 text-green-700",
    red: "bg-red-200 text-red-700",
    yellow: "bg-yellow-200 text-yellow-700",
    blue: "bg-blue-200 text-blue-700",
    gray: "bg-gray-200 text-gray-700",
};

const Chip = ({ title, color = 'green', style, ...props }) => {

    const colorStyles = colorMap[color] || colorMap.green;

    return (
        <div
            className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold capitalize ${style} ${colorStyles}`}
            {...props}
        >
            {title}
        </div>
    )
}

export default Chip;