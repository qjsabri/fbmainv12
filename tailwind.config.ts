import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: {
				DEFAULT: '0.75rem', // 12px
				sm: '1rem',         // 16px
				md: '1.5rem',       // 24px
				lg: '2rem',         // 32px
				xl: '2.5rem',       // 40px
			},
			screens: {
				'sm': '30rem',      // 480px
				'md': '48rem',      // 768px
				'lg': '64rem',      // 1024px
				'xl': '80rem',      // 1280px
				'2xl': '87.5rem'    // 1400px
			}
		},
		screens: {
			'xs': '20rem',        // 320px
			'sm': '30rem',        // 480px
			'md': '48rem',        // 768px
			'lg': '64rem',        // 1024px
			'xl': '80rem',        // 1280px
			'2xl': '96rem',       // 1536px
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			spacing: {
				'safe-top': 'env(safe-area-inset-top)',
				'safe-bottom': 'env(safe-area-inset-bottom)',
				'safe-left': 'env(safe-area-inset-left)',
				'safe-right': 'env(safe-area-inset-right)',
			},
			fontSize: {
				'responsive-xs': 'clamp(0.75rem, 1.5vw, 0.875rem)',   // 12px - 14px
				'responsive-sm': 'clamp(0.875rem, 2vw, 1rem)',        // 14px - 16px
				'responsive-base': 'clamp(1rem, 2.5vw, 1.125rem)',    // 16px - 18px
				'responsive-lg': 'clamp(1.125rem, 3vw, 1.25rem)',     // 18px - 20px
				'responsive-xl': 'clamp(1.25rem, 3.5vw, 1.5rem)',     // 20px - 24px
				'responsive-2xl': 'clamp(1.5rem, 4vw, 2rem)',         // 24px - 32px
				'responsive-3xl': 'clamp(1.75rem, 4.5vw, 2.5rem)',    // 28px - 40px
			},
			minHeight: {
				'touch': '2.75rem', // 44px minimum touch target
			},
			minWidth: {
				'touch': '2.75rem', // 44px minimum touch target
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [animate],
} satisfies Config;