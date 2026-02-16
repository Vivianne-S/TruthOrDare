import { getCategories } from "@/service/categories";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function CategoriesScreen() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <ActivityIndicator />;

  return (
    <View style={{ padding: 50 }}>
      <Text style={{ color: "black", fontSize: 18, marginBottom: 12 }}>
        Categories
      </Text>

      {categories.map((c) => (
        <Text key={c.id} style={{ color: "pink" }}>
          • {c.name}
        </Text>
      ))}
    </View>
  );
}