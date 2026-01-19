// 'use client';

// import { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import * as z from 'zod';
// import { useRouter } from 'next/navigation';
// import { motion } from 'framer-motion';
// import {
//   TextField,
//   Button,
//   IconButton,
//   InputAdornment,
//   CircularProgress,
//   Alert
// } from '@mui/material';
// import { Visibility, VisibilityOff, Lock, Email } from '@mui/icons-material';
// import { useAuth } from '@/context/AuthContext';
// import { poppins } from '@/layout';

// // Validation Schema
// const schema = z.object({
//   email: z.string().email('Invalid email address'),
//   password: z.string().min(1, 'Password is required'),
// });

// type AdminLoginInput = z.infer<typeof schema>;

// export default function AdminLoginPage() {
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();
//   const { login } = useAuth(); // Assuming generic login, we check role after

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<AdminLoginInput>({
//     resolver: zodResolver(schema),
//   });

//   const onSubmit = async (data: AdminLoginInput) => {
//     setLoading(true);
//     setError(null);
//     try {
//       // 1. Perform standard login
//       const result = await login(data.email, data.password);

//       if (result.success && result.user) {
//         // 2. STICT ROLE CHECK
//         // If the backend doesn't reject non-admins on a specific admin-endpoint,
//         // we must check here OR better yet, have a specific backend endpoint.
//         // For now, we assume the user object has a role.

//         if (result.user.role === 'ADMIN' || result.user.role === 'SUPER_ADMIN') {
//            router.replace('/admin');
//         } else {
//            throw new Error('Access denied. You do not have administrative privileges.');
//         }
//       } else {
//          throw new Error(result.error || 'Invalid credentials');
//       }
//     } catch (err: any) {
//       setError(err.message || 'An error occurred during login');
//       // If they logged in but aren't admin, logout immediately (optional but safe)
//       // logout();
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className={`min-h-screen flex items-center justify-center bg-[#F3F5F7] ${poppins.className}`}>
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="bg-white p-8 md:p-12 rounded-3xl shadow-xl w-full max-w-md mx-4"
//       >
//         {/* Header */}
//         <div className="text-center mb-10">
//             <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-black text-white mb-6 shadow-lg">
//                 <Lock sx={{ fontSize: 32 }} />
//             </div>
//             <h1 className="text-2xl font-bold text-[#141718] tracking-tight">
//                 Admin Portal
//             </h1>
//             <p className="text-gray-500 text-sm mt-2">
//                 Secure access for store administrators
//             </p>
//         </div>

//         {/* Error Alert */}
//         {error && (
//             <motion.div
//                 initial={{ opacity: 0, height: 0 }}
//                 animate={{ opacity: 1, height: 'auto' }}
//                 className="mb-6"
//             >
//                 <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>
//             </motion.div>
//         )}

//         {/* Form */}
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//             <TextField
//                 fullWidth
//                 label="Email Address"
//                 variant="outlined"
//                 {...register('email')}
//                 error={!!errors.email}
//                 helperText={errors.email?.message}
//                 InputProps={{
//                     startAdornment: (
//                         <InputAdornment position="start">
//                             <Email className="text-gray-400" />
//                         </InputAdornment>
//                     ),
//                     sx: { borderRadius: 3 }
//                 }}
//             />

//             <TextField
//                 fullWidth
//                 label="Password"
//                 type={showPassword ? 'text' : 'password'}
//                 variant="outlined"
//                 {...register('password')}
//                 error={!!errors.password}
//                 helperText={errors.password?.message}
//                 InputProps={{
//                     startAdornment: (
//                         <InputAdornment position="start">
//                             <Lock className="text-gray-400" />
//                         </InputAdornment>
//                     ),
//                     endAdornment: (
//                         <InputAdornment position="end">
//                             <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
//                                 {showPassword ? <VisibilityOff /> : <Visibility />}
//                             </IconButton>
//                         </InputAdornment>
//                     ),
//                     sx: { borderRadius: 3 }
//                 }}
//             />

//             <Button
//                 type="submit"
//                 fullWidth
//                 variant="contained"
//                 disabled={loading}
//                 sx={{
//                     py: 1.8,
//                     borderRadius: 3,
//                     bgcolor: '#141718',
//                     textTransform: 'none',
//                     fontSize: '16px',
//                     fontWeight: 600,
//                     boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
//                     '&:hover': {
//                         bgcolor: '#232627',
//                         boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
//                     }
//                 }}
//             >
//                 {loading ? <CircularProgress size={24} color="inherit" /> : 'Access Dashboard'}
//             </Button>

//             <div className="text-center mt-6">
//                 <a href="/" className="text-sm text-gray-400 hover:text-black transition-colors">
//                     ← Back to Store
//                 </a>
//             </div>
//         </form>
//       </motion.div>
//     </div>
//   );
// }
