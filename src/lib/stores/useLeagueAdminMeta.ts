import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { encryptedStorage } from '../encryptedStorage';
import { LeagueAdminType } from '@/models/league-administrator';

type LeagueAdminState = {
    leagueAdmin?: LeagueAdminType;
    setLeagueAdmin: (admin: LeagueAdminType) => void;
    updateLeagueAdmin: (admin: Partial<LeagueAdminType>) => void;
    resetLeagueAdmin: () => void;
};

export const useLeagueAdminStore = create<LeagueAdminState>()(
    persist(
        (set, get) => ({
            leagueAdmin: undefined,

            setLeagueAdmin: (admin) => set({ leagueAdmin: admin }),
            updateLeagueAdmin: (admin) =>
                set((state) => {
                    if (!state.leagueAdmin) return {};

                    return {
                        leagueAdmin: {
                            ...state.leagueAdmin,
                            ...admin,
                        },
                    };
                }),

            resetLeagueAdmin: () => set({ leagueAdmin: undefined }),
        }),
        {
            name: 'league-admin-store',
            storage: encryptedStorage,
        }
    )
);
