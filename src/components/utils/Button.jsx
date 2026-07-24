import Icon from "./Icon"

function Button({ btnName, style, onClick, btnIcon, btnIconSize, type, disabled, children }) {
    return (
        <button
            className={`shadow-md mt-2 py-1 px-3 rounded flex items-center cursor-pointer justify-center hover:shadow-md ${style}`}
            type={type ? type : "button"}
            onClick={onClick}
            disabled={disabled}
        >
            {btnIcon && <span className="mr-1"><Icon name={btnIcon} size={btnIconSize || 18} color="white" /></span>}
            {btnName || children}
        </button>
    )
}

export default Button