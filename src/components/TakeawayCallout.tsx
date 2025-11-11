interface TakeawayCalloutProps {
  icon: string;
  title: string;
  text: string;
  delay?: number;
}

export default function TakeawayCallout({ icon, title, text, delay = 0 }: TakeawayCalloutProps) {
  return (
    <div
      className="flex flex-col sm:flex-row gap-4 sm:gap-6 p-6 lg:p-8 bg-gradient-to-br from-blue-50 to-blue-100/50 border-l-4 border-accent rounded-xl shadow-sm hover:shadow-md transition-all duration-300 animate-slideIn"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-white rounded-xl shadow-sm text-2xl">
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
