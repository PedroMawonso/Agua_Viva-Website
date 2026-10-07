import {
  Bell,
  Calendar,
  ChevronRight,
  CreditCard,
  Download,
  Eye,
  Grid2x2,
  LogOut,
  Menu,
  Plus,
  Play,
  Radio,
  Search,
  Trash2,
  Users,
  User,
  Video,
  Check,
  X,
} from 'lucide-react';

const ICONS = {
  grid: Grid2x2,
  users: Users,
  user: User,
  card: CreditCard,
  video: Video,
  calendar: Calendar,
  bell: Bell,
  logout: LogOut,
  check: Check,
  x: X,
  plus: Plus,
  menu: Menu,
  search: Search,
  download: Download,
  play: Play,
  radio: Radio,
  eye: Eye,
  chevronRight: ChevronRight,
  trash: Trash2,
} as const;

type IconName = keyof typeof ICONS | 'cross';

export function Icon({
  name,
  className = 'w-5 h-5',
}: {
  name: IconName;
  className?: string;
}) {
  if (name === 'cross') {
    return (
      <X
        className={className}
        strokeWidth={1.75}
      />
    );
  }

  const Component = ICONS[name];

  if (!Component) {
    return null;
  }

  return (
    <Component
      className={className}
      strokeWidth={1.75}
    />
  );
}
