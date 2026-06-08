const FeatureCard = ({ title, description }: { title: string; description: string }) => {
    return (
        <div className="border border-card-foreground bg-card text-left text-card-foreground rounded-lg p-6 shadow-md">
            <img/>
            <h3 className="text-lg font-semibold mb-2 text-muted">{title}</h3>
            <p className="text-foreground text-sm">
                {description}
            </p>
        </div>
    );
};

export default FeatureCard;