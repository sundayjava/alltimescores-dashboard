interface Props {
    title: string;
    description?: string;
}

export function PageHeader({
    title,
    description
}: Props) {
    return (
        <div className="space-y-1">
            <h1 className="md:text-3xl text-xl font-bold">{title}</h1>
            <p className="text-muted-foreground mt-2 md:text-base text-md">
                {description}
            </p>

        </div>
    );
}