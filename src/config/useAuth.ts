import { computed } from "vue";
import { authService, authState } from "@/core/auth/authService";
import type { AuthStrategyName } from "@/core/auth/types";

export function useAuth(){
    const isAuthenticated = computed(() => authState.isAuthenticated);
    const currentStrategyName = computed(() => authState.activeStrategy);
    const availableStrategies = computed(() => authService.getAvailableStrategies());
    const activeStrategy = computed(() => authService.getActiveStrategy());

    const login = async (payload?: { username?: string; password?: string }) =>{
        return authService.login(payload);
    }

    const logout=async ()=>{
        await authService.logout();
        return true;
    }

    const handleRedirect = async ()=>{
        return authService.restoreSession();
    }

    const verifyOtp = async (otp: string) => {
        return authService.verifyOtp({ otp });
    };

    const setStrategy = async (strategyName: AuthStrategyName) => {
        await authService.setActiveStrategy(strategyName);
    };

    return {isAuthenticated,login,logout,handleRedirect,verifyOtp,setStrategy,currentStrategyName,availableStrategies,activeStrategy}
}
