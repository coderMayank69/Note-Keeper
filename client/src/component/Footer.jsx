import React from 'react'

const Footer = () => {
    return (
        <footer className="bg-gradient-to-r from-amber-600 to-orange-600 text-white py-6 mt-auto">
            <div className="w-full px-6 lg:px-12 text-center">
                <p className="text-amber-100">
                    © {new Date().getFullYear()} Note-Keeper. Crafted with care.
                </p>
            </div>
        </footer>
    )
}

export default Footer
