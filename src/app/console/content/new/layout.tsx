// This layout intentionally renders children WITHOUT the console sidebar/header
// so the editor can be truly full-screen like WordPress.
export default function EditorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}