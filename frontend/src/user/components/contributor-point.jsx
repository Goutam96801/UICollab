import { BadgeCent, Bolt } from "lucide-react";
import AnimationWrapper from "../../common/page-animation";

export default function ContributorPoint() {
  return (
    <AnimationWrapper transition={0.3} className={"absolute top-10 z-50"}>
      <div className="space-y-2 mt-2 p-4 rounded-md w-[320px] z-[999] bg-[#131313] duration-300  border-[#2a2a2a] border-2">
        {/* Header */}
        <div className="flex items-center gap-2 w-full justify-center">
          <BadgeCent color="teal" />
          <h2 className="text-lg font-bold">CollabCoins</h2>
        </div>

        {/* Description */}
        <p className="text-[#A1A1AA] text-sm text-center leading-relaxed font-semibold">
          Redeem our products for free using CollabCoins.
        </p>

        {/* Points Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold">You'll get:</h3>

          <div className="space-y-3">
            <PointRow
              points="200"
              description="When your blog gets published"
            />

            <PointRow
              points="100"
              description="When your post gets published"
            />

            <PointRow
              points="10"
              description="For every person that adds your post to their favorites"
            />
          </div>
        </div>
      </div>
    </AnimationWrapper>
  );
}

function PointRow({ points, description }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1 bg-black/20 p-2 rounded-xl min-w-[80px]">
        <BadgeCent color="teal" size={20}/>
        <span className="font-semibold">{points}</span>
      </div>
      <span className="text-[#A1A1AA] text-[15px] font-semibold">{description}</span>
    </div>
  );
}
