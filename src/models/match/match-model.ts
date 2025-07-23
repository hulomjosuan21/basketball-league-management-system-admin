// import { MatchCreateType, MatchType } from "./match-types";

// export class MatchCreateModel {
//   constructor(public data: MatchCreateType) {}

//   toJson(): MatchCreateType {
//     return { ...this.data };
//   }
// }

// export class MatchModel {
//   constructor(public data: MatchType) {}

//   toJson(): MatchType {
//     return { ...this.data };
//   }

//   static fromJson(data: MatchType): MatchModel {
//     return new MatchModel(data);
//   }

//   copyWith(update: Partial<MatchType>): MatchModel {
//     return new MatchModel({ ...this.data, ...update });
//   }

//   toChangedJson(update: Partial<MatchType>): Partial<MatchType> {
//     const changed: Partial<MatchType> = {};
//     for (const key in update) {
//       if (Object.prototype.hasOwnProperty.call(update, key)) {
//         const k = key as keyof MatchType;
//         const newValue = update[k];
//         const originalValue = this.data[k];

//         const isDate = newValue instanceof Date && originalValue instanceof Date;
//         const isDifferent = isDate
//           ? newValue.getTime() !== originalValue.getTime()
//           : newValue !== originalValue;

//         if (isDifferent) {
//           changed[k] = newValue as any;
//         }
//       }
//     }
//     return changed;
//   }
// }

// function isDifferent<T>(a: T, b: T): boolean {
//   if (a instanceof Date && b instanceof Date) {
//     return a.getTime() !== b.getTime();
//   }
//   return a !== b;
// }