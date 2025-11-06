import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Dimensions 
} from 'react-native';
import { 
  Card, 
  Title, 
  Paragraph, 
  ProgressBar, 
  Chip,
  IconButton 
} from 'react-native-paper';
import { 
  LineChart,
  BarChart,
  PieChart
} from 'react-native-chart-kit';
import ProgressWheel from '../../components/ProgressWheel';
import { 
  organizationData, 
  departments, 
  complianceScores,
  goals,
  chartColors 
} from '../../constants/Data';

const { width: screenWidth } = Dimensions.get('window');

export default function Dashboard() {
  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#10b981',
    },
  };

  const emissionData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      data: [14500, 13800, 13200, 12800, 12450, 11900],
    }]
  };

  const departmentData = {
    labels: departments.map(dept => dept.name),
    datasets: [{
      data: departments.map(dept => dept.monthlyEmissions)
    }]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Excellent': return '#10b981';
      case 'Good': return '#3b82f6';
      case 'Fair': return '#f59e0b';
      case 'Completed': return '#10b981';
      case 'On Track': return '#10b981';
      case 'At Risk': return '#ef4444';
      default: return '#64748b';
    }
  };

  const getStatusBackground = (status: string) => {
    switch (status) {
      case 'Excellent': return '#dcfce7';
      case 'Good': return '#f0f9ff';
      case 'Fair': return '#fefce8';
      case 'Completed': return '#dcfce7';
      case 'On Track': return '#dcfce7';
      case 'At Risk': return '#fef2f2';
      default: return '#f8fafc';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.statsRow}>
        <Card style={styles.statCard}>
          <Card.Content>
            <Text style={styles.statLabel}>Total Emissions</Text>
            <Text style={styles.statValue}>
              {organizationData.totalEmissions.toLocaleString()} kg CO₂e
            </Text>
            <View style={styles.trendContainer}>
              <IconButton
                icon={organizationData.monthlyTrend < 0 ? "trending-down" : "trending-up"}
                size={16}
                iconColor={organizationData.monthlyTrend < 0 ? "#10b981" : "#ef4444"}
              />
              <Text style={[
                styles.trendText,
                { color: organizationData.monthlyTrend < 0 ? "#10b981" : "#ef4444" }
              ]}>
                {Math.abs(organizationData.monthlyTrend)}%
              </Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content>
            <Text style={styles.statLabel}>Compliance Score</Text>
            <Text style={styles.statValue}>{organizationData.complianceScore}%</Text>
            <ProgressBar 
              progress={organizationData.complianceScore / 100} 
              color="#10b981"
              style={styles.progressBar}
            />
          </Card.Content>
        </Card>
      </View>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Emissions Overview</Title>
          <View style={styles.wheelContainer}>
            <ProgressWheel />
          </View>
        </Card.Content>
      </Card>

      {/* Emissions Trend Chart */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Monthly Emissions Trend</Title>
          <LineChart
            data={emissionData}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
            yAxisLabel=""
            yAxisSuffix=" kg"
            yAxisInterval={1}
          />
        </Card.Content>
      </Card>

      {/* Department Breakdown */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Department Breakdown</Title>
          <BarChart
            data={departmentData}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
            yAxisLabel=""
            yAxisSuffix=" kg"
            showValuesOnTopOfBars
            fromZero
          />
        </Card.Content>
      </Card>

      {/* Compliance Scores */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Compliance Status</Title>
          {complianceScores.map((score, index) => (
            <View key={index} style={styles.complianceItem}>
              <View style={styles.complianceHeader}>
                <Text style={styles.complianceName}>{score.standard}</Text>
                <Chip 
                  mode="outlined"
                  textStyle={[
                    styles.statusChipText,
                    { color: getStatusColor(score.status) }
                  ]}
                  style={[
                    styles.statusChip,
                    { 
                      backgroundColor: getStatusBackground(score.status),
                      borderColor: getStatusColor(score.status)
                    }
                  ]}
                >
                  {score.status}
                </Chip>
              </View>
              <ProgressBar 
                progress={score.score / 100} 
                color={getStatusColor(score.status)}
                style={styles.progressBar}
              />
              <Text style={styles.scoreText}>{score.score}/{score.maxScore}</Text>
            </View>
          ))}
        </Card.Content>
      </Card>

      {/* Goals Overview */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Goals Progress</Title>
          {goals.map((goal, index) => (
            <View key={goal.id} style={styles.goalItem}>
              <View style={styles.goalHeader}>
                <Text style={styles.goalTitle}>{goal.title}</Text>
                <Chip 
                  mode="outlined"
                  textStyle={[
                    styles.statusChipText,
                    { color: getStatusColor(goal.status) }
                  ]}
                  style={[
                    styles.statusChip,
                    { 
                      backgroundColor: getStatusBackground(goal.status),
                      borderColor: getStatusColor(goal.status)
                    }
                  ]}
                >
                  {goal.status}
                </Chip>
              </View>
              <ProgressBar 
                progress={goal.progress / 100} 
                color={getStatusColor(goal.status)}
                style={styles.progressBar}
              />
              <Text style={styles.progressText}>
                {goal.current}/{goal.target} {goal.unit} ({goal.progress}%)
              </Text>
            </View>
          ))}
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  statsRow: {
    flexDirection: 'row',
    padding: 10,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    elevation: 2,
  },
  statLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendText: {
    fontSize: 14,
    fontWeight: '600',
  },
  card: {
    margin: 10,
    backgroundColor: '#ffffff',
    elevation: 2,
  },
  wheelContainer: {
    alignItems: 'center',
    padding: 10,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 8,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    marginVertical: 8,
  },
  complianceItem: {
    marginBottom: 16,
  },
  complianceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  complianceName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    flex: 1,
    marginRight: 8,
  },
  statusChip: {
    minHeight: 28,
    paddingVertical: 2,
  },
  statusChipText: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
  },
  scoreText: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'right',
  },
  goalItem: {
    marginBottom: 16,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    flex: 1,
    marginRight: 8,
  },
  progressText: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'right',
  },
});