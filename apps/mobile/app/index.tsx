import { Text, View, StyleSheet } from "react-native";

export default function Home() {
  return <View style={styles.screen}><Text style={styles.kicker}>LifeOS AI Mobile</Text><Text style={styles.title}>Screen time, goals, and reports on the go.</Text><Text style={styles.body}>Android usage-access and iOS Screen Time permission flows sync mobile activity into your private LifeOS timeline.</Text></View>;
}
const styles = StyleSheet.create({ screen: { flex: 1, backgroundColor: "#020617", padding: 28, justifyContent: "center" }, kicker: { color: "#a78bfa", letterSpacing: 3, textTransform: "uppercase" }, title: { color: "white", fontSize: 42, fontWeight: "700", marginTop: 16 }, body: { color: "rgba(255,255,255,.62)", fontSize: 17, lineHeight: 25, marginTop: 18 } });
