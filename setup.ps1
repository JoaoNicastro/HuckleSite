Remove-Item .\node_modules -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item .\package*.json -Force -ErrorAction SilentlyContinue
npx -y create-vite@latest huckle-app --template react-ts
Move-Item huckle-app\* .\ -Force
Get-ChildItem -Path huckle-app -Hidden | Where-Object { $_.Name -ne '.' -and $_.Name -ne '..' } | Move-Item -Destination .\ -Force
Remove-Item huckle-app -Recurse -Force
npm install
npm install framer-motion lucide-react clsx tailwind-merge firebase react-router-dom
npm install -D tailwindcss @tailwindcss/vite
