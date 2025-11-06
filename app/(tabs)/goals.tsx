import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { 
  Card, 
  Title, 
  Paragraph, 
  ProgressBar, 
  Chip,
  Button,
  IconButton 
} from 'react-native-paper';
import { goals } from '../../constants/Data';

export default function Goals() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'On Track': return '#10b981';
      case 'At Risk': return '#ef4444';
      case 'Completed': return '#3b82f6';
      default: return '#64748b';
    }
  };

  const getStatusBackground = (status: string) => {
    switch (status) {
      case 'On Track': return '#dcfce7';
      case 'At Risk': return '#fef2f2';
      case 'Completed': return '#f0f9ff';
      default: return '#f8fafc';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'On Track': return 'check-circle';
      case 'At Risk': return 'alert-circle';
      case 'Completed': return 'flag';
      default: return 'circle';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.headerCard}>
        <Card.Content>
          <Title>Sustainability Goals</Title>
          <Paragraph>
            Track progress towards your carbon reduction and sustainability targets
          </Paragraph>
        </Card.Content>
      </Card>

      {/* Progress Overview - Simplified without chart */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Overall Progress</Title>
          <View style={styles.progressOverview}>
            <View style={styles.overviewStats}>
              <View style={styles.overviewStat}>
                <Text style={styles.overviewValue}>3</Text>
                <Text style={styles.overviewLabel}>Active Goals</Text>
              </View>
              <View style={styles.overviewStat}>
                <Text style={styles.overviewValue}>45%</Text>
                <Text style={styles.overviewLabel}>Avg. Progress</Text>
              </View>
              <View style={styles.overviewStat}>
                <Text style={styles.overviewValue}>2</Text>
                <Text style={styles.overviewLabel}>On Track</Text>
              </View>
            </View>
            <ProgressBar 
              progress={0.45} 
              color="#10b981"
              style={styles.overallProgressBar}
            />
            <Text style={styles.overallProgressText}>Overall Progress: 45%</Text>
          </View>
        </Card.Content>
      </Card>

      {/* Rest of the goals list remains the same */}
      {goals.map((goal) => (
        <Card key={goal.id} style={styles.goalCard}>
          <Card.Content>
            <View style={styles.goalHeader}>
              <View style={styles.goalTitleSection}>
                <IconButton
                  icon={getStatusIcon(goal.status)}
                  size={20}
                  iconColor={getStatusColor(goal.status)}
                />
                <View style={styles.goalTextContainer}>
                  <Title style={styles.goalTitle}>{goal.title}</Title>
                  <Paragraph style={styles.goalDeadline}>
                    Deadline: {new Date(goal.deadline).toLocaleDateString()}
                  </Paragraph>
                </View>
              </View>
              <Chip 
                mode="outlined"
                style={[
                  styles.statusChip, 
                  { 
                    borderColor: getStatusColor(goal.status),
                    backgroundColor: getStatusBackground(goal.status)
                  }
                ]}
                textStyle={[
                  styles.statusChipText,
                  { color: getStatusColor(goal.status) }
                ]}
              >
                {goal.status}
              </Chip>
            </View>

            <View style={styles.progressSection}>
              <View style={styles.progressLabels}>
                <Text style={styles.progressText}>
                  {goal.current} {goal.unit}
                </Text>
                <Text style={styles.progressText}>
                  {goal.target} {goal.unit}
                </Text>
              </View>
              <ProgressBar 
                progress={goal.progress / 100} 
                color={getStatusColor(goal.status)}
                style={styles.progressBar}
              />
              <Text style={styles.progressPercentage}>{goal.progress}% Complete</Text>
            </View>

            <View style={styles.goalDetails}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Target</Text>
                <Text style={styles.detailValue}>{goal.target} {goal.unit}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Current</Text>
                <Text style={styles.detailValue}>{goal.current} {goal.unit}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Remaining</Text>
                <Text style={styles.detailValue}>{goal.target - goal.current} {goal.unit}</Text>
              </View>
            </View>

            <View style={styles.goalActions}>
              <Button 
                mode="outlined" 
                compact 
                style={styles.actionButton}
                onPress={() => {}}
              >
                Update Progress
              </Button>
              <Button 
                mode="text" 
                compact 
                style={styles.actionButton}
                onPress={() => {}}
              >
                View Details
              </Button>
            </View>
          </Card.Content>
        </Card>
      ))}

      {/* Completed Goals */}
      <Card style={styles.completedCard}>
        <Card.Content>
          <View style={styles.completedHeader}>
            <Title style={styles.completedTitle}>Completed Goals</Title>
            <Chip 
              mode="outlined" 
              icon="check" 
              style={styles.completedChip}
              textStyle={styles.completedChipText}
            >
              0 Goals
            </Chip>
          </View>
          <Paragraph style={styles.completedText}>
            No goals have been completed yet. Keep working towards your targets!
          </Paragraph>
        </Card.Content>
      </Card>

      {/* Add New Goal */}
      <Card style={styles.addCard}>
        <Card.Content style={styles.addCardContent}>
          <IconButton
            icon="plus-circle"
            size={40}
            iconColor="#10b981"
            onPress={() => {}}
          />
          <Text style={styles.addCardText}>Set New Goal</Text>
          <Paragraph style={styles.addCardDescription}>
            Create new sustainability targets for your organization
          </Paragraph>
          <Button mode="contained" style={styles.addButton}>
            Add Goal
          </Button>
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
  headerCard: {
    margin: 10,
    backgroundColor: '#ffffff',
  },
  card: {
    margin: 10,
    marginTop: 0,
    backgroundColor: '#ffffff',
  },
  progressOverview: {
    paddingVertical: 10,
  },
  overviewStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  overviewStat: {
    alignItems: 'center',
  },
  overviewValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#10b981',
  },
  overviewLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  overallProgressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  overallProgressText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
  goalCard: {
    margin: 10,
    marginTop: 0,
    backgroundColor: '#ffffff',
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  goalTitleSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    marginRight: 12,
  },
  goalTextContainer: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 16,
  },
  goalDeadline: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
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
  progressSection: {
    marginBottom: 16,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  progressPercentage: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
  goalDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
  },
  detailItem: {
    alignItems: 'center',
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  goalActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
  },
  completedCard: {
    margin: 10,
    backgroundColor: '#f8fafc',
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: '#cbd5e1',
  },
  completedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  completedTitle: {
    fontSize: 16,
    color: '#64748b',
  },
  completedChip: {
    minHeight: 28,
    paddingVertical: 2,
    borderColor: '#10b981',
    backgroundColor: '#dcfce7',
  },
  completedChipText: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
    color: '#10b981',
  },
  completedText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  addCard: {
    margin: 10,
    backgroundColor: '#ffffff',
  },
  addCardContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  addCardText: {
    fontSize: 16,
    color: '#1e293b',
    marginTop: 8,
    fontWeight: '600',
  },
  addCardDescription: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: '#10b981',
  },
});