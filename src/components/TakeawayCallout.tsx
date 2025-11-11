import type { TakeawayType } from '../utils/takeaways';

interface TakeawayCalloutProps {
  type: TakeawayType;
  icon: string;
  title: string;
  text: string;
  delay?: number;
}

export default function TakeawayCallout({ type, icon, title, text, delay = 0 }: TakeawayCalloutProps) {
  // Color schemes per insight type
  const colorSchemes = {
    warning: {
      bg: 'from-yellow-50 to-yellow-100/50',
      border: 'border-yellow-400',
      iconBg: 'bg-yellow-50',
    },
    success: {
      bg: 'from-green-50 to-green-100/50',
      border: 'border-success',
      iconBg: 'bg-green-50',
    },
    tip: {
      bg: 'from-blue-50 to-blue-100/50',
      border: 'border-accent',
      iconBg: 'bg-blue-50',
    },
    info: {
      bg: 'from-indigo-50 to-indigo-100/50',
      border: 'border-indigo-400',
      iconBg: 'bg-indigo-50',
    },
  };

  const colors = colorSchemes[type];

  return (
    <div
      className={`flex flex-col sm:flex-row gap-4 sm:gap-6 p-6 lg:p-8 bg-gradient-to-br ${colors.bg} border-l-4 ${colors.border} rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 animate-slideIn`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`flex-shrink-0 w-12 h-12 flex items-center justify-center ${colors.iconBg} rounded-xl shadow-sm text-2xl border border-gray-200/50`}>
        {icon}
      </div>
      <div className="flex-1">
        <h4 className="text-lg font-bold text-gray-900 mb-2">
          {title}
        </h4>
        <p className="text-gray-700 leading-relaxed">
          {text}
        </p>
      </div>
    </div>
  );
}
