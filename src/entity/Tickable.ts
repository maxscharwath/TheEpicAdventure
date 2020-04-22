export default interface Tickable {
    ticks: number;

    onTick(): void;
}
