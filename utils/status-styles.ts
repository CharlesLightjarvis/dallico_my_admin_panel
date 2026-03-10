import type { UserStatus } from "../types/user-status";
import type { ExamStatus } from "../types/exam-status";
import type { GroupStatus } from "../types/group-status";
import type { ModelltestStatus } from "../types/modelltest-status";

const userStatusStyles: Record<UserStatus, { badge: string; icon: string }> = {
  active: {
    badge: "bg-green-500/10 text-green-600 border border-green-500/20",
    icon: "text-green-600",
  },
  inactive: {
    badge: "bg-gray-500/10 text-gray-500 border border-gray-500/20",
    icon: "text-gray-500",
  },
  restricted: {
    badge: "bg-red-500/10 text-red-600 border border-red-500/20",
    icon: "text-red-600",
  },
};

// const centerStatusStyles: Record<
//   CenterStatus,
//   { badge: string; icon: string }
// > = {
//   active: {
//     badge: "bg-green-500/10 text-green-600 border border-green-500/20",
//     icon: "text-green-600",
//   },
//   inactive: {
//     badge: "bg-gray-500/10 text-gray-500 border border-gray-500/20",
//     icon: "text-gray-500",
//   },
//   pending: {
//     badge: "bg-amber-500/10 text-amber-600 border border-amber-500/20",
//     icon: "text-amber-600",
//   },
// };

export const getUserStatusStyle = (
  status: UserStatus | null
): { badge: string; icon: string } => {
  if (!status || !(status in userStatusStyles)) {
    return {
      badge: "bg-gray-500/10 text-gray-500 border border-gray-500/20",
      icon: "text-gray-500",
    };
  }
  return userStatusStyles[status];
};

// export const getCenterStatusStyle = (
//   status: CenterStatus | null
// ): { badge: string; icon: string } => {
//   if (!status || !(status in centerStatusStyles)) {
//     return {
//       badge: "bg-gray-500/10 text-gray-500 border border-gray-500/20",
//       icon: "text-gray-500",
//     };
//   }
//   return centerStatusStyles[status];
// };

const examStatusStyles: Record<ExamStatus, { badge: string; icon: string }> = {
  active: {
    badge: "bg-green-500/10 text-green-600 border border-green-500/20",
    icon: "text-green-600",
  },
  inactive: {
    badge: "bg-gray-500/10 text-gray-500 border border-gray-500/20",
    icon: "text-gray-500",
  },
};

export const getExamStatusStyle = (
  status: ExamStatus | null
): { badge: string; icon: string } => {
  if (!status || !(status in examStatusStyles)) {
    return {
      badge: "bg-gray-500/10 text-gray-500 border border-gray-500/20",
      icon: "text-gray-500",
    };
  }
  return examStatusStyles[status];
};

const groupStatusStyles: Record<GroupStatus, { badge: string; icon: string }> =
  {
    active: {
      badge: "bg-green-500/10 text-green-600 border border-green-500/20",
      icon: "text-green-600",
    },
    inactive: {
      badge: "bg-gray-500/10 text-gray-500 border border-gray-500/20",
      icon: "text-gray-500",
    },
  };

export const getGroupStatusStyle = (
  status: GroupStatus | null
): { badge: string; icon: string } => {
  if (!status || !(status in groupStatusStyles)) {
    return {
      badge: "bg-gray-500/10 text-gray-500 border border-gray-500/20",
      icon: "text-gray-500",
    };
  }
  return groupStatusStyles[status];
};

const modelltestStatusStyles: Record<
  ModelltestStatus,
  { badge: string; icon: string }
> = {
  active: {
    badge: "bg-green-500/10 text-green-600 border border-green-500/20",
    icon: "text-green-600",
  },
  inactive: {
    badge: "bg-gray-500/10 text-gray-500 border border-gray-500/20",
    icon: "text-gray-500",
  },
};

export const getModelltestStatusStyle = (
  status: ModelltestStatus | null
): { badge: string; icon: string } => {
  if (!status || !(status in modelltestStatusStyles)) {
    return {
      badge: "bg-gray-500/10 text-gray-500 border border-gray-500/20",
      icon: "text-gray-500",
    };
  }
  return modelltestStatusStyles[status];
};
