import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

type UserRole = 'admin' | 'moderator' | 'user';

class RBAC {
  private static instance: RBAC;
  private supabase: SupabaseClient<Database>;
  private roles: { [key: string]: UserRole } = {};
  private initialized = false;

  constructor(supabaseClient: SupabaseClient<Database>) {
    this.supabase = supabaseClient;
  }

  private constructor() {}

  public static getInstance(supabase: SupabaseClient<Database>): RBAC {
    if (!RBAC.instance) {
      RBAC.instance = new RBAC(supabase);
    }
    return RBAC.instance;
  }

  public async initialize(userId: string): Promise<void> {
    if (this.initialized) return;
    
    const { data, error } = await this.supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .single();

    if (data) {
      this.roles[userId] = data.role as UserRole;
    } else {
      // Default role if not specified
      this.roles[userId] = 'user';
    }
    
    this.initialized = true;
  }

  public hasRole(userId: string, requiredRole: UserRole): boolean {
    const userRole = this.roles[userId];
    if (!userRole) return false;
    
    const roleHierarchy: Record<UserRole, number> = {
      'admin': 3,
      'moderator': 2,
      'user': 1
    };
    
    return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
  }

  public async checkPermission(userId: string, requiredRole: UserRole): Promise<boolean> {
    await this.initialize(userId);
    return this.hasRole(userId, requiredRole);
  }
}

// This should be initialized in your app's root with a Supabase client
export function createRBAC(supabase: SupabaseClient<Database>) {
  return RBAC.getInstance(supabase);
}

// React hook for components
export function useRBAC(supabase: SupabaseClient<Database>) {
  const rbac = createRBAC(supabase);
  
  const checkPermission = async (requiredRole: UserRole): Promise<boolean> => {
    const { data: { user } } = await supabase.auth.getUser();
    return user ? rbac.checkPermission(user.id, requiredRole) : false;
  };

  return { checkPermission };
}
