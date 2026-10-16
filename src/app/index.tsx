import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { supabase } from "../lib/supabase";

type Category = {
  id: string | number;
  name?: string;
  title?: string;
};

export default function Index() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    setLoading(true);
    setError("");

    const { data, error: queryError } = await supabase
      .from("categories")
      .select("*")
      .limit(10);

    if (queryError) {
      setError(queryError.message);
      setCategories([]);
    } else {
      setCategories((data ?? []) as Category[]);
    }

    setLoading(false);
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Test Game</Text>
        <Text style={styles.subtitle}>Supabase Database Connection</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Connection Status</Text>

          {loading ? (
            <View style={styles.row}>
              <ActivityIndicator color="#057DB0" />
              <Text style={styles.info}>Connecting...</Text>
            </View>
          ) : error ? (
            <Text style={styles.error}>Connection / Query Error: {error}</Text>
          ) : (
            <Text style={styles.success}>
              Connected! Categories loaded: {categories.length}
            </Text>
          )}
        </View>

        <Text style={styles.sectionTitle}>Categories</Text>

        {!loading && !error && categories.length === 0 && (
          <Text style={styles.info}>
            No categories found. Add some records in Supabase.
          </Text>
        )}

        {categories.map((category) => (
          <View key={String(category.id)} style={styles.category}>
            <Text style={styles.categoryName}>
              {category.name ?? category.title ?? `Category #${category.id}`}
            </Text>
            <Text style={styles.categoryId}>ID: {category.id}</Text>
          </View>
        ))}

        {!!error && (
          <Text style={styles.help}>
            Check your .env credentials, table name, Data API permissions and
            Row Level Security policies.
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F7FB",
  },
  content: {
    padding: 24,
    paddingTop: 40,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#057DB0",
  },
  subtitle: {
    fontSize: 15,
    color: "#64748B",
    marginTop: 6,
    marginBottom: 24,
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 16,
    marginBottom: 28,
  },
  label: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
    color: "#1E293B",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  info: {
    color: "#64748B",
    fontSize: 14,
    marginTop: 6,
  },
  success: {
    color: "#15803D",
    fontSize: 15,
    fontWeight: "600",
  },
  error: {
    color: "#DC2626",
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 21,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 14,
  },
  category: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
  },
  categoryId: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 5,
  },
  help: {
    color: "#64748B",
    marginTop: 14,
    lineHeight: 21,
  },
});
