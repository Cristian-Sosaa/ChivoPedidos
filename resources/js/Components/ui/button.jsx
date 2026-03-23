// resources/js/Components/ui/button.jsx
import * as React from 'react';
import { cn } from '@/lib/utils';

const buttonVariants = {
    variant: {
        default: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm',
        destructive: 'bg-red-600 text-white hover:bg-red-700 shadow-sm',
        outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 shadow-sm',
        secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 shadow-sm',
        ghost: 'text-gray-700 hover:bg-gray-100',
        link: 'text-indigo-600 underline-offset-4 hover:underline',
    },
    size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
    },
};

const Button = React.forwardRef(
    ({ className, variant = 'default', size = 'default', ...props }, ref) => {
        return (
            <button
                className={cn(
                    'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
                    buttonVariants.variant[variant],
                    buttonVariants.size[size],
                    className,
                )}
                ref={ref}
                {...props}
            />
        );
    },
);
Button.displayName = 'Button';

export { Button, buttonVariants };