import {AppFooter} from "@/components/AppNavbar";

export default function PageLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <>
            <div className="min-h-screen bg-secondary-50">
                <main className="mx-auto">{children}</main>
                <AppFooter />
            </div>
        </>
    );
}