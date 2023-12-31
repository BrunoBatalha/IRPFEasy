import React, { useState } from "react"

interface Props {
    initialTab: number;
    tabs: string[];
    children: React.ReactNode[]
}

export default function Tabs({ children, initialTab, tabs }: Props) {
    const [currentTab, setCurrentTab] = useState(initialTab)

    return (
        <>
            <div className="border-gray-300 border-solid border-b-2 mb-10">
                {tabs.map((t, i) => (
                    <button key={t}
                        data-isTabSelected={i === currentTab}
                        className={`
                            px-20 py-2 
                            hover:bg-gray-50 
                            transition 
                            data-[isTabSelected=true]:cs-shadow-bottom-orange-500 
                            data-[isTabSelected=true]:text-gray-800
                            data-[isTabSelected=false]:text-gray-500
                        `}
                        onClick={() => setCurrentTab(i)}>
                        {t}
                    </button>
                ))}
            </div>

            <section>
                {children.find((_, i) => i === currentTab)}
            </section>
        </>
    )
}