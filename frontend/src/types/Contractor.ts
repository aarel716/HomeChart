export interface Contractor {
    id: number;
    userId: number;
    categoryId: number;
    categoryName: string;
    name: string;
    phone: string | null;
    email: string | null;
    isActive: boolean;
}

export interface NewContractor {
    categoryId: number;
    name: string;
    phone: string;
    email: string;
}
