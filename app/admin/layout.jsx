import AdminLayout from "@/components/admin/AdminLayout";

export const metadata = {
    title: "Pickart. - Admin",
    description: "Pickart. - Admin",
};

export default function RootAdminLayout({ children }) {

    return (
        <>
            <AdminLayout>
                {children}
            </AdminLayout>
        </>
    );
}
