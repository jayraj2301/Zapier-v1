"use client";
import { Appbar } from "@/components/Appbar";
import { CheckFeature } from "@/components/CheckFeature";
import { Input } from "@/components/Input";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { BACKEND_URL } from "../config";
import { useRouter } from "next/navigation";

export default function Page() {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const router = useRouter();
    
    return <div> 
        <Appbar />
        <div className="flex justify-center">
            <div className="flex pt-8 max-w-4xl">
                <div className="flex-1 pt-20 px-4">
                    <div className="font-semibold text-3xl pb-4">
                    Join millions worldwide who automate their work using Zapier.
                    </div>
                    <div className="pb-6 pt-4">
                        <CheckFeature label={"Easy setup, no coding required"} />
                    </div>
                    <div className="pb-6">
                        <CheckFeature label={"Free forever for core features"} />
                    </div>
                    <CheckFeature label={"14-day trial of premium features & apps"} />

                </div>
                <div className="flex-1 pt-6 pb-6 mt-12 px-4 border rounded">
                    
                        <>
                            <Input 
                                onChange={e => setEmail(e.target.value)} 
                                label={"Email"} 
                                type="email" 
                                placeholder="Your Email"
                                // value={email}
                            />
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Enter verification code sent to {email}
                                </label>
                                <OTPInput 
                                    value={otp}
                                    onChange={setOtp}
                                    length={4}
                                />
                            </div>
                            <div className="pt-4">
                                <PrimaryButton 
                                    onClick={async () => {
                                        try {
                                            const res = await axios.post(`${BACKEND_URL}/api/v1/user/verify`, {
                                                email,
                                                otp:Number(otp)
                                            });
                                            // localStorage.setItem("token", res.data.token);
                                            router.push("/dashboard");
                                        } catch (error) {
                                            console.error("Error verifying OTP:", error);
                                        }
                                    }} 
                                    size="big"
                                    disabled={otp.length !== 6}
                                >
                                    Verify
                                </PrimaryButton>
                            </div>
                        </>
                </div>
            </div>
        </div>
    </div>
}


function OTPInput({ 
  value = "", 
  onChange, 
  length = 4, 
  disabled = false,
  className = ""
}: {
    value: string,
    onChange: (otp: string) => void,
    length: number,
    disabled?: boolean,
    className?: string
}) {
  const [otp, setOtp] = useState(value.split('').slice(0, length));
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    setOtp(value.split('').slice(0, length));
  }, [value, length]);

  const handleChange = (index: number, val: string) => {
    if (disabled) return;
    
    const newVal = val.slice(-1); // Only take the last character
    const newOtp = [...otp];
    newOtp[index] = newVal;
    setOtp(newOtp);
    
    // Call onChange with the complete OTP string
    onChange(newOtp.join(''));
    
    // Auto-focus next input
    if (newVal && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: any) => {
    if (disabled) return;
    
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // If current input is empty, focus previous and clear it
        inputRefs.current[index - 1]?.focus();
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        onChange(newOtp.join(''));
      } else {
        // Clear current input
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
        onChange(newOtp.join(''));
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: any) => {
    if (disabled) return;
    
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').replace(/\D/g, ''); // Only numbers
    const pastedArray = pastedData.split('').slice(0, length);
    
    const newOtp = [...otp];
    pastedArray.forEach((char: string, idx: number) => {
      if (idx < length) {
        newOtp[idx] = char;
      }
    });
    
    setOtp(newOtp);
    onChange(newOtp.join(''));
    
    // Focus the next empty input or the last input
    const nextEmptyIndex = newOtp.findIndex(val => !val);
    const focusIndex = nextEmptyIndex !== -1 ? nextEmptyIndex : length - 1;
    inputRefs.current[focusIndex]?.focus();
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          ref={el => { inputRefs.current[index] = el; }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={otp[index] || ''}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
          className={`
            w-12 h-12 text-center text-lg font-medium
            border-2 rounded-md
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200
            ${otp[index] ? 'border-gray-300' : 'border-gray-200'}
            hover:border-gray-300
          `}
          aria-label={`OTP digit ${index + 1}`}
        />
      ))}
    </div>
  );
}