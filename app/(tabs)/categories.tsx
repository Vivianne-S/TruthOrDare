import { useCategories } from "@/hooks/use-categories";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

export default function CategoriesScreen() {
  const {
    categories,
    loading,
    openCategoryId,
    questionsByCategory,
    questionsLoadingByCategory,
    handlePressCategory,
  } = useCategories();

  if (loading) return <ActivityIndicator color="#FFFFFF" />;

  return (
    <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 80, paddingBottom: 140 }}>
      <Text style={{ color: "#F7E8FF", fontSize: 18, marginBottom: 12 }}>
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
                  <Text style={{ color: "#DCC7F5" }}>Loading questions...</Text>
                ) : questions.length === 0 ? (
                  <Text style={{ color: "#DCC7F5" }}>
                    No questions found for this category.
                  </Text>
                ) : (
                  questions.map((q, i) => (
                    <Text
                      key={`${c.id}-${i}`}
                      style={{ color: "#F7E8FF", marginBottom: 6 }}
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