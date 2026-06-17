import EmbirLogo from '@/components/brand/EmbirLogo';

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0a0614]">
      <div className="animate-pulse">
        <EmbirLogo size="lg" variant="mark" />
      </div>
    </div>
  );
}
