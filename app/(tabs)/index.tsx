import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  Dimensions,
  Alert
} from 'react-native';
import { 
  Card, 
  Title, 
  Paragraph, 
  ProgressBar, 
  Chip,
  IconButton,
  Button,
  Menu,
  Divider
} from 'react-native-paper';
import { Colors } from '../../constants/Colors';

const { width: screenWidth } = Dimensions.get('window');

// Mock data
const organizationData = {
  name: "TechGreen Solutions Inc.",
  totalEmissions: 12450,
  monthlyTrend: -8.2,
  complianceScore: 82,
  sustainabilityRating: "B+"
};

const departments = [
  {
    id: "1",
    name: "Transport",
    manager: "Sarah Chen",
    emissionSources: ["Fleet Vehicles", "Business Travel", "Logistics"],
    monthlyEmissions: 5800,
    trend: "down" as const
  },
  {
    id: "2",
    name: "Energy",
    manager: "Mike Rodriguez",
    emissionSources: ["Electricity", "Natural Gas", "Generator"],
    monthlyEmissions: 6850,
    trend: "stable" as const
  }
];

const complianceScores = [
  {
    standard: "ISO 14064-1:2018",
    score: 85,
    maxScore: 100,
    status: "Excellent" as const,
  },
  {
    standard: "GHG Protocol",
    score: 78,
    maxScore: 100,
    status: "Good" as const,
  }
];

export default function Dashboard() {
  const [menuVisible, setMenuVisible] = useState<string>('');

  const getTrendColor = (trend: number) => {
    return trend < 0 ? Colors.success : Colors.error;
  };

  const getTrendIcon = (trend: number) => {
    return trend < 0 ? "trending-down" : "trending-up";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Excellent': return Colors.success;
      case 'Good': return Colors.info;
      case 'Needs Improvement': return Colors.warning;
      default: return Colors.textTertiary;
    }
  };

  const handleQuickAction = (action: string) => {
    Alert.alert('Quick Action', `${action} initiated`);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Welcome Header */}
      <Card style={styles.headerCard}>
        <Card.Content>
          <View style={styles.welcomeHeader}>
            <View>
              <Title style={styles.welcomeTitle}>Welcome back!</Title>
              <Paragraph style={styles.welcomeSubtitle}>
                Here's your sustainability overview
              </Paragraph>
            </View>
            <Button 
              mode="contained" 
              icon="plus"
              onPress={() => handleQuickAction('Add New Entry')}
            >
              New Entry
            </Button>
          </View>
        </Card.Content>
      </Card>

      {/* Key Metrics */}
      <View style={styles.metricsRow}>
        <Card style={styles.metricCard}>
          <Card.Content>
            <View style={styles.metricHeader}>
              <Text style={styles.metricLabel}>Total Emissions</Text>
              <IconButton
                icon="information"
                size={16}
                iconColor={Colors.textTertiary}
                onPress={() => Alert.alert('Info', 'Total CO2 equivalent emissions')}
              />
            </View>
            <Text style={styles.metricValue}>
              {organizationData.totalEmissions.toLocaleString()} kg
            </Text>
            <View style={styles.trendContainer}>
              <IconButton
                icon={getTrendIcon(organizationData.monthlyTrend)}
                size={16}
                iconColor={getTrendColor(organizationData.monthlyTrend)}
              />
              <Text style={[styles.trendText, { color: getTrendColor(organizationData.monthlyTrend) }]}>
                {Math.abs(organizationData.monthlyTrend)}%
              </Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.metricCard}>
          <Card.Content>
            <View style={styles.metricHeader}>
              <Text style={styles.metricLabel}>Compliance Score</Text>
              <IconButton
                icon="information"
                size={16}
                iconColor={Colors.textTertiary}
                onPress={() => Alert.alert('Info', 'Overall compliance rating')}
              />
            </View>
            <Text style={styles.metricValue}>{organizationData.complianceScore}%</Text>
            <ProgressBar 
              progress={organizationData.complianceScore / 100} 
              color={Colors.primary}
              style={styles.progressBar}
            />
          </Card.Content>
        </Card>
      </View>

      {/* Quick Actions */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Quick Actions</Title>
          <View style={styles.actionsGrid}>
            <Button 
              mode="outlined" 
              icon="cloud-upload"
              style={styles.quickAction}
              onPress={() => handleQuickAction('Upload Data')}
            >
              Upload Data
            </Button>
            <Button 
              mode="outlined" 
              icon="chart-bar"
              style={styles.quickAction}
              onPress={() => handleQuickAction('Generate Report')}
            >
              Generate Report
            </Button>
            <Button 
              mode="outlined" 
              icon="target"
              style={styles.quickAction}
              onPress={() => handleQuickAction('Set Target')}
            >
              Set Target
            </Button>
            <Button 
              mode="outlined" 
              icon="cog"
              style={styles.quickAction}
              onPress={() => handleQuickAction('Settings')}
            >
              Settings
            </Button>
          </View>
        </Card.Content>
      </Card>

      {/* Department Overview */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Title style={styles.cardTitle}>Department Overview</Title>
            <Button 
              mode="text" 
              icon="chevron-right"
              onPress={() => Alert.alert('Navigation', 'Navigate to Departments')}
            >
              View All
            </Button>
          </View>
          
          {departments.map((dept, index) => (
            <View key={dept.id}>
              <View style={styles.departmentItem}>
                <View style={styles.departmentInfo}>
                  <Text style={styles.departmentName}>{dept.name}</Text>
                  <Text style={styles.departmentManager}>{dept.manager}</Text>
                  <Text style={styles.departmentEmissions}>
                    {dept.monthlyEmissions.toLocaleString()} kg CO₂e
                  </Text>
                </View>
                <View style={styles.departmentActions}>
                  <Chip 
                    icon={dept.trend === 'down' ? 'trending-down' : 
                          dept.trend === 'stable' ? 'trending-up' : 'minus'}
                    mode="outlined"
                    style={[
                      styles.trendChip,
                      { 
                        backgroundColor: 
                          dept.trend === 'down' ? '#f0fdf4' :
                          dept.trend === 'stable' ? '#fef2f2' : '#f0f9ff'
                      }
                    ]}
                  >
                    {dept.trend === 'down' ? 'Decreasing' : 
                     dept.trend === 'stable' ? 'Increasing' : 'Stable'}
                  </Chip>
                  <Menu
                    visible={menuVisible === dept.id}
                    onDismiss={() => setMenuVisible('')}
                    anchor={
                      <IconButton
                        icon="dots-vertical"
                        size={20}
                        onPress={() => setMenuVisible(dept.id)}
                      />
                    }
                  >
                    <Menu.Item 
                      leadingIcon="chart-box" 
                      onPress={() => Alert.alert('View Analytics', `Analytics for ${dept.name}`)} 
                      title="View Analytics" 
                    />
                    <Menu.Item 
                      leadingIcon="pencil" 
                      onPress={() => Alert.alert('Edit', `Edit ${dept.name}`)} 
                      title="Edit Department" 
                    />
                  </Menu>
                </View>
              </View>
              {index < departments.length - 1 && <Divider style={styles.divider} />}
            </View>
          ))}
        </Card.Content>
      </Card>

      {/* Compliance Status */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Compliance Status</Title>
          {complianceScores.map((score, index) => (
            <View key={index} style={styles.complianceItem}>
              <View style={styles.complianceHeader}>
                <Text style={styles.complianceName}>{score.standard}</Text>
                <Chip 
                  mode="outlined"
                  textStyle={{ fontSize: 12 }}
                  style={[
                    styles.statusChip,
                    { 
                      backgroundColor: 
                        score.status === 'Excellent' ? '#f0fdf4' :
                        score.status === 'Good' ? '#f0f9ff' : '#fef2f2'
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

      {/* Recent Activity */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Title style={styles.cardTitle}>Recent Activity</Title>
            <Button 
              mode="text" 
              icon="refresh"
              onPress={() => Alert.alert('Refresh', 'Activity refreshed')}
            >
              Refresh
            </Button>
          </View>
          
          <View style={styles.activityList}>
            <View style={styles.activityItem}>
              <IconButton icon="check-circle" iconColor={Colors.success} size={20} />
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Emission data uploaded</Text>
                <Text style={styles.activityTime}>2 hours ago</Text>
              </View>
            </View>
            
            <View style={styles.activityItem}>
              <IconButton icon="alert-circle" iconColor={Colors.warning} size={20} />
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Transport department exceeded target</Text>
                <Text style={styles.activityTime}>5 hours ago</Text>
              </View>
            </View>
            
            <View style={styles.activityItem}>
              <IconButton icon="information" iconColor={Colors.info} size={20} />
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Monthly report generated</Text>
                <Text style={styles.activityTime}>1 day ago</Text>
              </View>
            </View>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerCard: {
    margin: 16,
    marginBottom: 12,
    backgroundColor: Colors.surface,
    elevation: 2,
  },
  welcomeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  metricsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 12,
  },
  metricCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    elevation: 2,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  metricLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
    flex: 1,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: -8,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    marginTop: 8,
  },
  card: {
    margin: 16,
    marginTop: 0,
    marginBottom: 12,
    backgroundColor: Colors.surface,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickAction: {
    flex: 1,
    minWidth: '45%',
  },
  departmentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  departmentInfo: {
    flex: 1,
  },
  departmentName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  departmentManager: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  departmentEmissions: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
  departmentActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendChip: {
    height: 32,
  },
  divider: {
    backgroundColor: Colors.border,
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
    color: Colors.textPrimary,
    flex: 1,
  },
  statusChip: {
    height: 24,
  },
  scoreText: {
    fontSize: 12,
    color: Colors.textTertiary,
    textAlign: 'right',
  },
  activityList: {
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityContent: {
    flex: 1,
    marginLeft: 8,
  },
  activityTitle: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  activityTime: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginTop: 2,
  },
});