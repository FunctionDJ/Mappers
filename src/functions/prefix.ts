import { Mapping } from "../mapping";

export default (text: string) => (([v, a]: string[]): Mapping => [text+"_"+v, a])
