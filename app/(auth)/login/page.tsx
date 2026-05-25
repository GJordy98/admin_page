"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Eye, EyeOff } from "lucide-react";

const LOGIN_URL = `${process.env.NEXT_PUBLIC_API_URL || 'https://api.edrtimpharmacie.com/api/v1'}/token/`;

const COUNTRY_CODES = [
  { code: "+237", label: "Cameroun (CMR)" },
  { code: "+241", label: "Gabon (GAB)" },
  { code: "+242", label: "Congo (COG)" },
  { code: "+225", label: "Côte d'Ivoire (CIV)" },
  { code: "+33",  label: "France (FRA)" },
];

export default function LoginPage() {
  const router = useRouter();
  
  const [password, setPassword]       = useState("");
  const [telephone, setTelephone]     = useState("");
  const [countryCode, setCountryCode] = useState("+237");
  const [showPassword, setShowPassword] = useState(false);
  
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleLogin = async () => {
    if (!password || !telephone) {
      setError("Veuillez renseigner votre téléphone et mot de passe.");
      return;
    }
    
    // Format full telephone
    const fullTelephone = telephone.startsWith("+") 
      ? telephone 
      : `${countryCode}${telephone.replace(/^0+/, '')}`;

    setLoading(true);
    setError("");
    try {
      const res = await fetch(LOGIN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // The payload requires telephone and password
        body: JSON.stringify({ 
          telephone: fullTelephone, 
          password: password 
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          data?.detail || 
          data?.non_field_errors?.[0] || 
          data?.telephone?.[0] ||
          "Identifiants incorrects."
        );
      }

      const data = await res.json();

      const accessToken = data?.access || data?.token || data?.access_token;
      const refreshToken = data?.refresh || data?.refresh_token;

      if (!accessToken) {
        throw new Error("Réponse du serveur invalide — aucun token reçu.");
      }

      localStorage.setItem("admin_token", accessToken);
      if (refreshToken) {
        localStorage.setItem("admin_refresh_token", refreshToken);
      }

      router.replace("/");
    } catch (err: any) {
      setError(err.message || "Une erreur s'est produite lors de la connexion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border border-gray-100 shadow-xl rounded-2xl">
        <CardHeader className="text-center pb-2 pt-8">
          <div className="w-14 h-14 bg-gradient-to-br from-[#8c57ff] to-[#7a49e6] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-200">
            <span className="text-white font-bold text-xl">eD</span>
          </div>
          <CardTitle className="text-2xl font-bold text-[#2f2b3d]">eDoctor Admin</CardTitle>
          <p className="text-sm text-gray-500 mt-1">Connectez-vous à votre espace administrateur</p>
        </CardHeader>
        <CardContent className="space-y-5 px-8 pb-8 pt-4">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="telephone" className="text-sm font-semibold text-gray-700">Numéro de téléphone</Label>
              <div className="flex gap-2">
                <Select value={countryCode} onValueChange={(val) => { if (val) setCountryCode(val); }}>
                <SelectTrigger className="w-[110px] h-11 rounded-lg border-gray-200 bg-gray-50 font-medium">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRY_CODES.map(c => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.code} {c.label.split(' ')[0]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                id="telephone"
                type="tel"
                placeholder="6XX XX XX XX"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                className="flex-1 h-11 rounded-lg border-gray-200 focus-visible:ring-[#8c57ff]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-semibold text-gray-700">Mot de passe</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="h-11 rounded-lg border-gray-200 focus-visible:ring-[#8c57ff] pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-3">
              <p className="text-sm text-red-600 font-medium">{error}</p>
            </div>
          )}

          <Button
            className="w-full h-11 bg-[#8c57ff] hover:bg-[#7a49e6] text-white rounded-xl font-semibold shadow-lg shadow-purple-200 transition-all mt-2"
            onClick={handleLogin}
            disabled={loading}
          >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 size={18} className="animate-spin" /> Connexion...
                </span>
              ) : "Se connecter"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
