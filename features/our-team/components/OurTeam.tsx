"use client";

import { useState } from "react";
import SectionHeading from "./SectionHeading";
import TeamToggle from "./TeamToggle";
import TeamMemberCard from "./TeamMemberCard";
import { AdvisorItem } from "../actions/advisors";
import { MemberItem } from "../actions/members";
import { AlumniItem } from "../actions/alumni";

interface OurTeamProps {
  advisors: AdvisorItem[];
  members: MemberItem[];
  alumni: AlumniItem[];
}

type SectionType = "members" | "alumni";

const OurTeam = ({ advisors, members, alumni }: OurTeamProps) => {
  const [activeSection, setActiveSection] = useState<SectionType>("members");

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-32">
        <h1
          data-aos="fade-up"
          className="text-6xl md:text-8xl font-bold tracking-tighter text-white mb-8"
        >
          OUR TEAM
        </h1>
        <p
          data-aos="fade-up"
          data-aos-delay="100"
          className="text-neutral-400 max-w-2xl mx-auto text-base md:text-lg font-light leading-relaxed"
        >
          The visionaries and innovators behind Club Excel. From our dedicated
          advisors to our successful alumni network.
        </p>
      </div>

      <section className="mb-40">
        <SectionHeading title="Club Advisors" accent="blue" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {advisors.map((advisor, idx) => (
            <TeamMemberCard
              key={advisor.id}
              name={advisor.name}
              role={advisor.role}
              designation={advisor.designation ?? undefined}
              label="Club Advisor"
              img={advisor.imageUrl}
              links={advisor.links}
              accent="blue"
              size="advisor"
              delay={idx * 100}
            />
          ))}
        </div>
      </section>

      <TeamToggle active={activeSection} onChange={setActiveSection} />

      {activeSection === "members" ? (
        <section className="mb-40 transition-all duration-500">
          <SectionHeading title="Core Members" accent="purple" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {members.map((member, idx) => (
              <TeamMemberCard
                key={member.id}
                name={member.name}
                role={member.role}
                designation={member.designation ?? undefined}
                label="Core Member"
                img={member.imageUrl}
                links={member.links}
                accent="purple"
                size="member"
                delay={(idx % 4) * 50}
              />
            ))}
          </div>
        </section>
      ) : (
        <section className="transition-all duration-500">
          <SectionHeading title="Distinguished Alumni" accent="purple" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {alumni.map((member, idx) => (
              <TeamMemberCard
                key={member.id}
                name={member.name}
                role={member.role}
                designation={member.designation ?? undefined}
                label="Alumnus"
                img={member.imageUrl}
                links={member.links}
                accent="purple"
                size="member"
                delay={(idx % 4) * 50}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default OurTeam;
