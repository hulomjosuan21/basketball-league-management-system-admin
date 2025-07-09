export const TableHeaderWithHelper = ({ headerText, helperText }: { headerText: string, helperText: string }) => (
    <div className="flex items-center gap-1">
        <span>{headerText}</span>
        <span className="text-xs text-muted-foreground">{helperText}</span>
    </div>
)