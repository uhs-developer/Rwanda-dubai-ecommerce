// Debug script to check environment variables
console.log('Environment Variables Debug:');
console.log('VITE_FLUTTERWAVE_PUBLIC_KEY:', import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY);
console.log('All VITE_ variables:', import.meta.env);
console.log('NODE_ENV:', import.meta.env.MODE);
console.log('DEV:', import.meta.env.DEV);
console.log('PROD:', import.meta.env.PROD);
