import Icon from "./Icon"

function Button({ btnName, style, onClick, btnIcon, type, disabled }) {
    return (
        <button
            className={`shadow-sm py-1 px-3 rounded flex items-center justify-center cursor-pointer hover:shadow-lg ${style}`}
            className={`shadow-md py-[4px] px-3 rounded flex items-center justify-center hover:shadow-lg ${style}`}
            type={type ? type : "button"}
            onClick={onClick}
            disabled={disabled}
        >
            {btnIcon && <span className="mr-1"><Icon name={btnIcon} size={18} color="white" /></span>}
            {btnName}
        </button>
    )
}

export default Button