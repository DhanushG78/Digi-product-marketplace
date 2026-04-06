"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { useAppConfig } from "@/hooks/useAppConfig";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut 
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"buyer" | "seller">("buyer");
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const user = useStore((state) => state.user);
  const { appName } = useAppConfig();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim() || (isRegistering && !name.trim())) {
      toast.error("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      if (isRegistering) {
        // 1. Create User
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;

        // 2. Store role/name in Firestore
        await setDoc(doc(db, "users", firebaseUser.uid), {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: name,
          role: role,
          createdAt: new Date().toISOString(),
        });

        toast.success("Account created successfully!");
      } else {
        // Sign In
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Signed in successfully!");
      }
      router.push("/");
    } catch (error: any) {
      console.error("Auth Error:", error);
      toast.error(error.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out.");
    } catch (error) {
      toast.error("Failed to log out.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 px-4 dark:bg-gray-950 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-3xl bg-white p-10 shadow-xl dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
        {user ? (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-violet-100 dark:bg-violet-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
               <span className="text-2xl font-bold text-violet-600 dark:text-violet-400">
                 {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
               </span>
            </div>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white">Welcome back, {user.name || "User"}!</h2>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700">
              <p className="text-sm font-bold text-gray-500 uppercase flex justify-between">
                <span>Role</span>
                <span className="text-violet-600 dark:text-violet-400">{user.role}</span>
              </p>
              <p className="text-sm font-bold text-gray-500 uppercase flex justify-between mt-2">
                <span>Email</span>
                <span className="text-gray-900 dark:text-gray-100">{user.email}</span>
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 text-white py-3 rounded-xl font-bold hover:bg-red-600 transition"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <>
            <div className="text-center">
              <h2 className="text-3xl font-black tracking-tight text-gray-900 dark:text-gray-100">
                {isRegistering ? "Join our Community" : `Welcome back to ${appName}`}
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {isRegistering ? "Discover & sell amazing digital products." : "Sign in to access your digital marketplace."}
              </p>
            </div>
            
            <form className="mt-8 space-y-6" onSubmit={handleAuth}>
              <div className="space-y-4 rounded-md shadow-sm">
                {isRegistering && (
                  <>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        className="block w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-violet-500 focus:outline-none focus:ring-violet-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 sm:text-sm transition shadow-sm"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Account Persona</label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setRole("buyer")}
                          className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold border transition-all ${role === "buyer" ? 'bg-violet-600 text-white border-violet-600 shadow-lg' : 'bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'}`}
                        >
                          I'm a Buyer
                        </button>
                        <button
                          type="button"
                          onClick={() => setRole("seller")}
                          className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold border transition-all ${role === "seller" ? 'bg-violet-600 text-white border-violet-600 shadow-lg' : 'bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'}`}
                        >
                          I'm a Seller
                        </button>
                      </div>
                      <p className="mt-2 text-[10px] text-gray-400 italic">
                        {role === "seller" ? "Sellers can list new items and manage their products." : "Buyers can wishlist items and make payments."}
                      </p>
                    </div>
                  </>
                )}
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    className="block w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-violet-500 focus:outline-none focus:ring-violet-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 sm:text-sm transition shadow-sm"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    className="block w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-violet-500 focus:outline-none focus:ring-violet-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 sm:text-sm transition shadow-sm"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative flex w-full justify-center rounded-xl border border-transparent bg-violet-600 px-4 py-3.5 text-sm font-black text-white hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 transition disabled:opacity-50 shadow-lg hover:shadow-violet-500/20"
                >
                  {loading ? "Processing..." : (isRegistering ? "Create Account" : "Sign In")}
                </button>
              </div>

              <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                {isRegistering ? "Already have an account?" : "New to the platform?"}{" "}
                <button 
                  type="button"
                  onClick={() => setIsRegistering(!isRegistering)}
                  className="font-bold text-violet-600 hover:text-violet-500"
                >
                  {isRegistering ? "Sign In" : "Sign Up"}
                </button>
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
