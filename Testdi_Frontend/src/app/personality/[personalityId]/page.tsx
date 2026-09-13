"use client";

import { useEffect, useState, use } from "react";
import { personalityApi, CharacterItem } from "@/api/personalityApi";
import { PersonalityDetail } from "@/components/personality/PersonalityDetail";
import { Loading } from "@/components/common/Loading";

export default function PersonalityPage({ params }: { params: Promise<{ personalityId: string }> }) {
  const resolvedParams = use(params);
  const personalityId = resolvedParams.personalityId;

  const [character, setCharacter] = useState<CharacterItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await personalityApi.getCharacterByType(personalityId);
      if (data) {
        setCharacter(data);
      } else {
        // Fallback dummy character
        setCharacter({
          _id: personalityId,
          personalityType: personalityId,
          name: personalityId,
          description: "Linh thú đại diện cho cấu trúc tâm hồn độc bản trong hệ thống TESTDII.",
        });
      }
      setLoading(false);
    }
    loadData();
  }, [personalityId]);

  if (loading) {
    return <Loading message="Đang tải thông tin tính cách..." fullScreen />;
  }

  return (
    <div className="py-8 bg-[#fafaf8] transition-colors duration-200">
      <PersonalityDetail character={character!} code={personalityId} />
    </div>
  );
}
