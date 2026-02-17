import { getCategories, getQuestionsByCategory } from "@/service/categories";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

type Question = {
  type: string;
  question_text: string;
};

export default function CategoriesScreen() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Sparar frågor per kategori-id (så vi kan visa dem under rätt kategori)
  const [questionsByCategory, setQuestionsByCategory] = useState<
    Record<string, Question[]>
  >({});
  const [questionsLoadingByCategory, setQuestionsLoadingByCategory] = useState<
    Record<string, boolean>
  >({});

  // För att kunna toggla öppna/stänga
  const [openCategoryId, setOpenCategoryId] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const data = await getCategories();
        if (alive) setCategories(data);
      } catch (e) {
        console.log("getCategories error:", e);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const handlePressCategory = async (categoryId: string) => {
    if (openCategoryId === categoryId) {
      setOpenCategoryId(null);
      return;
    }

    setOpenCategoryId(categoryId);

    if (
      questionsByCategory[categoryId] ||
      questionsLoadingByCategory[categoryId] === true
    )
      return;

    try {
      setQuestionsLoadingByCategory((prev) => ({
        ...prev,
        [categoryId]: true,
      }));

      const data = await getQuestionsByCategory(categoryId);
      setQuestionsByCategory((prev) => ({
        ...prev,
        [categoryId]: data,
      }));
    } catch (e) {
      console.log("getQuestionsByCategory error:", e);
    } finally {
      setQuestionsLoadingByCategory((prev) => ({
        ...prev,
        [categoryId]: false,
      }));
    }
  };

  if (loading) return <ActivityIndicator />;

  return (
    <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 80 }}>
      <Text style={{ color: "black", fontSize: 18, marginBottom: 12 }}>
        Categories (tap to show questions)
      </Text>

      {categories.map((c) => {
        const isOpen = openCategoryId === c.id;
        const isLoadingQuestions = questionsLoadingByCategory[c.id] === true;
        const hasLoadedQuestions = Object.prototype.hasOwnProperty.call(
          questionsByCategory,
          c.id
        );
        const questions = hasLoadedQuestions ? questionsByCategory[c.id] : [];

        return (
          <View key={c.id} style={{ marginBottom: 14 }}>
            <Pressable
              onPress={() => handlePressCategory(c.id)}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 12,
                borderRadius: 10,
                backgroundColor: "rgba(157,78,221,0.10)",
              }}
            >
              <Text style={{ color: "#FF2E9F", fontSize: 16 }}>
                • {c.name}
              </Text>
            </Pressable>

            {isOpen && (
              <View style={{ paddingLeft: 12, paddingTop: 8 }}>
                {isLoadingQuestions ? (
                  <ActivityIndicator size="small" />
                ) : !hasLoadedQuestions ? (
                  <Text style={{ color: "gray" }}>Loading questions...</Text>
                ) : questions.length === 0 ? (
                  <Text style={{ color: "gray" }}>
                    No questions found for this category.
                  </Text>
                ) : (
                  questions.map((q, i) => (
                    <Text
                      key={`${c.id}-${i}`}
                      style={{ color: "black", marginBottom: 6 }}
                    >
                      {q.type.toUpperCase()}: {q.question_text}
                    </Text>
                  ))
                )}
              </View>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
}