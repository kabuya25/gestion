import {RemoveScroll} from 'react-remove-scroll'
const LoadingScreen = () => {
    return(
        <RemoveScroll>
            <div className="h-full w-full bg-gray-500/50 fixed top-0 left-0 z-50 flex justify-center items-center">
                <svg
                    className="h-24 w-24 mr-3"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#6366f1"
                >
                    <g>
                        <circle
                            className=""
                            cx="3"
                            cy="12"
                            r="2"
                        />
                        <circle
                            cx="21"
                            cy="12"
                            r="2"
                        />
                        <circle
                            cx="12"
                            cy="21"
                            r="2"
                        />
                        <circle
                            cx="12"
                            cy="3"
                            r="2"
                        />
                        <circle
                            cx="5.64"
                            cy="5.64"
                            r="2"
                        />
                        <circle
                            cx="18.36"
                            cy="18.36"
                            r="2"
                        />
                        <circle
                            cx="5.64"
                            cy="18.36"
                            r="2"
                        />
                        <circle
                            cx="18.36"
                            cy="5.64"
                            r="2"
                        />
                        <animateTransform
                            attributeName="transform"
                            type="rotate"
                            dur="1.5s"
                            values="0 12 12;360 12 12"
                            repeatCount="indefinite"
                        />
                    </g>
                </svg>
            </div>
        </RemoveScroll>
    )

}

export default LoadingScreen