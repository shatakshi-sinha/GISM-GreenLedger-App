import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Dimensions } from 'react-native';
import { 
  Card, 
  Title, 
  Paragraph, 
  ProgressBar, 
  Chip,
  Button,
  IconButton,
  Modal,
  Portal,
  Provider,
  TextInput,
  Menu,
  Divider
} from 'react-native-paper';

const { width: screenWidth } = Dimensions.get('window');

// Types
interface Goal {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
  deadline: string;
  progress: number;
  status: 'On Track' | 'At Risk' | 'Completed';
}

// Mock data
const initialGoals: Goal[] = [
  {
    id: "1",
    title: "Reduce Energy Consumption",
    target: 20,
    current: 12,
    unit: "%",
    deadline: "2024-12-31",
    progress: 60,
    status: "On Track"
  },
  {
    id: "2",
    title: "Increase Renewable Energy",
    target: 50,
    current: 25,
    unit: "%",
    deadline: "2024-12-31",
    progress: 50,
    status: "On Track"
  },
  {
    id: "3",
    title: "Reduce Fleet Emissions",
    target: 30,
    current: 8,
    unit: "%",
    deadline: "2024-12-31",
    progress: 27,
    status: "At Risk"
  }
];

export default function Goals() {
  // State management
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [modalVisible, setModalVisible] = useState(false);
  const [progressModalVisible, setProgressModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<string>('');
  const [menuVisible, setMenuVisible] = useState<string>('');
  
  // New goal form state
  const [newGoal, setNewGoal] = useState({
    title: '',
    target: '',
    unit: '%',
    deadline: new Date().toISOString().split('T')[0]
  });
  
  // Progress update state
  const [progressValue, setProgressValue] = useState('');

  // Status colors and icons
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'On Track': return '#10b981';
      case 'At Risk': return '#ef4444';
      case 'Completed': return '#3b82f6';
      default: return '#64748b';
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

  // Calculate overall progress
  const overallProgress = goals.length > 0 
    ? Math.round(goals.reduce((acc, goal) => acc + goal.progress, 0) / goals.length)
    : 0;

  const onTrackGoals = goals.filter(goal => goal.status === 'On Track').length;

  // Add new goal
  const handleAddGoal = () => {
    if (!newGoal.title.trim() || !newGoal.target.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const targetValue = parseFloat(newGoal.target);
    if (isNaN(targetValue) || targetValue <= 0) {
      Alert.alert('Error', 'Please enter a valid target value');
      return;
    }

    const newGoalItem: Goal = {
      id: Date.now().toString(),
      title: newGoal.title,
      target: targetValue,
      current: 0,
      unit: newGoal.unit,
      deadline: newGoal.deadline,
      progress: 0,
      status: 'On Track'
    };

    setGoals([...goals, newGoalItem]);
    setNewGoal({
      title: '',
      target: '',
      unit: '%',
      deadline: new Date().toISOString().split('T')[0]
    });
    setModalVisible(false);
    Alert.alert('Success', 'Goal added successfully!');
  };

  // Update goal progress
  const handleUpdateProgress = () => {
    if (!progressValue.trim()) {
      Alert.alert('Error', 'Please enter progress value');
      return;
    }

    const currentValue = parseFloat(progressValue);
    const goal = goals.find(g => g.id === selectedGoal);
    
    if (!goal) return;

    if (isNaN(currentValue) || currentValue < 0) {
      Alert.alert('Error', 'Please enter a valid progress value');
      return;
    }

    if (currentValue > goal.target) {
      Alert.alert('Warning', 'Progress cannot exceed target value');
      return;
    }

    const progress = (currentValue / goal.target) * 100;
    const status = progress >= 100 ? 'Completed' : 
                  progress >= (goal.target * 0.7) ? 'On Track' : 'At Risk';

    setGoals(prev => prev.map(g => 
      g.id === selectedGoal 
        ? { ...g, current: currentValue, progress, status }
        : g
    ));

    setProgressModalVisible(false);
    setProgressValue('');
    Alert.alert('Success', 'Progress updated successfully!');
  };

  // Delete goal
  const handleDeleteGoal = () => {
    setGoals(prev => prev.filter(goal => goal.id !== selectedGoal));
    setDeleteModalVisible(false);
    setMenuVisible('');
    Alert.alert('Success', 'Goal deleted successfully!');
  };

  // Open progress modal
  const openProgressModal = (goalId: string) => {
    const goal = goals.find(g => g.id === goalId);
    if (goal) {
      setSelectedGoal(goalId);
      setProgressValue(goal.current.toString());
      setProgressModalVisible(true);
      setMenuVisible('');
    }
  };

  // Open delete confirmation
  const openDeleteModal = (goalId: string) => {
    setSelectedGoal(goalId);
    setDeleteModalVisible(true);
    setMenuVisible('');
  };

  // Reset form
  const resetForm = () => {
    setNewGoal({
      title: '',
      target: '',
      unit: '%',
      deadline: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <Provider>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header Card */}
        <Card style={styles.headerCard}>
          <Card.Content>
            <Title style={styles.headerTitle}>Sustainability Goals</Title>
            <Paragraph style={styles.headerSubtitle}>
              Track progress towards your carbon reduction and sustainability targets
            </Paragraph>
          </Card.Content>
        </Card>

        {/* Progress Overview */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.progressHeader}>
              <Title>Overall Progress</Title>
              <Chip mode="outlined" icon="trending-up" style={styles.progressChip}>
                {overallProgress}% Complete
              </Chip>
            </View>
            
            <View style={styles.progressOverview}>
              <View style={styles.overviewStats}>
                <View style={styles.overviewStat}>
                  <Text style={styles.overviewValue}>{goals.length}</Text>
                  <Text style={styles.overviewLabel}>Active Goals</Text>
                </View>
                <View style={styles.overviewStat}>
                  <Text style={styles.overviewValue}>{overallProgress}%</Text>
                  <Text style={styles.overviewLabel}>Avg. Progress</Text>
                </View>
                <View style={styles.overviewStat}>
                  <Text style={styles.overviewValue}>{onTrackGoals}</Text>
                  <Text style={styles.overviewLabel}>On Track</Text>
                </View>
              </View>
              
              <ProgressBar 
                progress={overallProgress / 100} 
                color="#10b981"
                style={styles.overallProgressBar}
              />
              <Text style={styles.overallProgressText}>
                Overall completion: {overallProgress}%
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Goals List */}
        {goals.map((goal) => (
          <Card key={goal.id} style={styles.goalCard}>
            <Card.Content>
              <View style={styles.goalHeader}>
                <View style={styles.goalTitleSection}>
                  <IconButton
                    icon={getStatusIcon(goal.status)}
                    size={24}
                    iconColor={getStatusColor(goal.status)}
                    style={styles.statusIcon}
                  />
                  <View style={styles.goalTextContainer}>
                    <Title style={styles.goalTitle}>{goal.title}</Title>
                    <Paragraph style={styles.goalDeadline}>
                      Deadline: {new Date(goal.deadline).toLocaleDateString()} • 
                      Target: {goal.target} {goal.unit}
                    </Paragraph>
                  </View>
                </View>
                
                <Menu
                  visible={menuVisible === goal.id}
                  onDismiss={() => setMenuVisible('')}
                  anchor={
                    <IconButton
                      icon="dots-vertical"
                      size={20}
                      onPress={() => setMenuVisible(goal.id)}
                    />
                  }
                >
                  <Menu.Item 
                    leadingIcon="chart-line" 
                    onPress={() => openProgressModal(goal.id)} 
                    title="Update Progress" 
                  />
                  <Menu.Item 
                    leadingIcon="pencil" 
                    onPress={() => Alert.alert('Edit', `Edit ${goal.title}`)} 
                    title="Edit Goal" 
                  />
                  <Divider />
                  <Menu.Item 
                    leadingIcon="delete" 
                    onPress={() => openDeleteModal(goal.id)} 
                    title="Delete" 
                    titleStyle={{ color: '#ef4444' }}
                  />
                </Menu>
              </View>

              <Chip 
                mode="outlined"
                style={[styles.statusChip, { borderColor: getStatusColor(goal.status) }]}
                textStyle={{ color: getStatusColor(goal.status), fontSize: 12 }}
              >
                {goal.status}
              </Chip>

              <View style={styles.progressSection}>
                <View style={styles.progressLabels}>
                  <Text style={styles.progressText}>
                    Current: {goal.current} {goal.unit}
                  </Text>
                  <Text style={styles.progressText}>
                    Target: {goal.target} {goal.unit}
                  </Text>
                </View>
                <ProgressBar 
                  progress={goal.progress / 100} 
                  color={getStatusColor(goal.status)}
                  style={styles.progressBar}
                />
                <View style={styles.progressInfo}>
                  <Text style={styles.progressPercentage}>{goal.progress}% Complete</Text>
                  <Text style={styles.remainingText}>
                    {goal.target - goal.current} {goal.unit} remaining
                  </Text>
                </View>
              </View>

              <View style={styles.goalActions}>
                <Button 
                  mode="outlined" 
                  icon="chart-line"
                  style={styles.actionButton}
                  onPress={() => openProgressModal(goal.id)}
                >
                  Update Progress
                </Button>
                <Button 
                  mode="contained" 
                  icon="eye"
                  style={styles.actionButton}
                  onPress={() => Alert.alert('Goal Details', 
                    `Title: ${goal.title}\nProgress: ${goal.current}/${goal.target} ${goal.unit}\nStatus: ${goal.status}\nDeadline: ${new Date(goal.deadline).toLocaleDateString()}`)}
                >
                  View Details
                </Button>
              </View>
            </Card.Content>
          </Card>
        ))}

        {/* Empty State */}
        {goals.length === 0 && (
          <Card style={styles.emptyCard}>
            <Card.Content style={styles.emptyContent}>
              <IconButton
                icon="flag-outline"
                size={48}
                iconColor="#94a3b8"
                style={styles.emptyIcon}
              />
              <Title style={styles.emptyTitle}>No Goals Set</Title>
              <Paragraph style={styles.emptyText}>
                Start by creating your first sustainability goal to track progress.
              </Paragraph>
              <Button 
                mode="contained" 
                icon="plus"
                style={styles.emptyButton}
                onPress={() => setModalVisible(true)}
              >
                Create First Goal
              </Button>
            </Card.Content>
          </Card>
        )}

        {/* Add New Goal Card */}
        {goals.length > 0 && (
          <Card style={styles.addCard}>
            <Card.Content style={styles.addCardContent}>
              <IconButton
                icon="plus-circle"
                size={40}
                iconColor="#10b981"
                onPress={() => {
                  resetForm();
                  setModalVisible(true);
                }}
              />
              <Text style={styles.addCardText}>Set New Goal</Text>
              <Paragraph style={styles.addCardDescription}>
                Create new sustainability targets for your organization
              </Paragraph>
              <Button 
                mode="contained" 
                icon="plus"
                style={styles.addButton}
                onPress={() => {
                  resetForm();
                  setModalVisible(true);
                }}
              >
                Add New Goal
              </Button>
            </Card.Content>
          </Card>
        )}
      </ScrollView>

      {/* Add Goal Modal */}
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Card>
            <Card.Content>
              <Title style={styles.modalTitle}>Set New Sustainability Goal</Title>
              
              <TextInput
                label="Goal Title *"
                value={newGoal.title}
                onChangeText={(text) => setNewGoal(prev => ({ ...prev, title: text }))}
                style={styles.input}
                mode="outlined"
                placeholder="e.g., Reduce Carbon Emissions"
              />

              <View style={styles.inputRow}>
                <TextInput
                  label="Target Value *"
                  value={newGoal.target}
                  onChangeText={(text) => setNewGoal(prev => ({ ...prev, target: text }))}
                  keyboardType="numeric"
                  style={[styles.input, styles.flexInput]}
                  mode="outlined"
                  placeholder="0"
                />
                <TextInput
                  label="Unit"
                  value={newGoal.unit}
                  onChangeText={(text) => setNewGoal(prev => ({ ...prev, unit: text }))}
                  style={[styles.input, styles.unitInput]}
                  mode="outlined"
                  placeholder="%"
                />
              </View>

              <TextInput
                label="Deadline"
                value={newGoal.deadline}
                onChangeText={(text) => setNewGoal(prev => ({ ...prev, deadline: text }))}
                style={styles.input}
                mode="outlined"
                placeholder="YYYY-MM-DD"
              />

              <View style={styles.modalActions}>
                <Button 
                  mode="outlined" 
                  onPress={() => setModalVisible(false)}
                  style={styles.modalButton}
                >
                  Cancel
                </Button>
                <Button 
                  mode="contained" 
                  onPress={handleAddGoal}
                  style={styles.modalButton}
                >
                  Create Goal
                </Button>
              </View>
            </Card.Content>
          </Card>
        </Modal>
      </Portal>

      {/* Update Progress Modal */}
      <Portal>
        <Modal
          visible={progressModalVisible}
          onDismiss={() => setProgressModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Card>
            <Card.Content>
              <Title style={styles.modalTitle}>Update Progress</Title>
              <Paragraph style={styles.modalSubtitle}>
                Current progress for: {goals.find(g => g.id === selectedGoal)?.title}
              </Paragraph>
              
              <TextInput
                label="Current Progress *"
                value={progressValue}
                onChangeText={setProgressValue}
                keyboardType="numeric"
                style={styles.input}
                mode="outlined"
                placeholder="Enter current value"
              />

              <View style={styles.modalActions}>
                <Button 
                  mode="outlined" 
                  onPress={() => setProgressModalVisible(false)}
                  style={styles.modalButton}
                >
                  Cancel
                </Button>
                <Button 
                  mode="contained" 
                  onPress={handleUpdateProgress}
                  style={styles.modalButton}
                >
                  Update Progress
                </Button>
              </View>
            </Card.Content>
          </Card>
        </Modal>
      </Portal>

      {/* Delete Confirmation Modal */}
      <Portal>
        <Modal
          visible={deleteModalVisible}
          onDismiss={() => setDeleteModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Card>
            <Card.Content>
              <Title style={styles.modalTitle}>Delete Goal</Title>
              <Paragraph style={styles.modalSubtitle}>
                Are you sure you want to delete "{goals.find(g => g.id === selectedGoal)?.title}"?
                This action cannot be undone.
              </Paragraph>

              <View style={styles.modalActions}>
                <Button 
                  mode="outlined" 
                  onPress={() => setDeleteModalVisible(false)}
                  style={styles.modalButton}
                >
                  Cancel
                </Button>
                <Button 
                  mode="contained" 
                  buttonColor="#ef4444"
                  onPress={handleDeleteGoal}
                  style={styles.modalButton}
                >
                  Delete
                </Button>
              </View>
            </Card.Content>
          </Card>
        </Modal>
      </Portal>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  headerCard: {
    margin: 16,
    marginBottom: 8,
    backgroundColor: '#ffffff',
    elevation: 2,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  card: {
    margin: 16,
    marginTop: 8,
    backgroundColor: '#ffffff',
    elevation: 2,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressChip: {
    backgroundColor: '#f0fdf4',
  },
  progressOverview: {
    paddingVertical: 8,
  },
  overviewStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  overviewStat: {
    alignItems: 'center',
    flex: 1,
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
    textAlign: 'center',
  },
  overallProgressBar: {
    height: 10,
    borderRadius: 5,
    marginBottom: 8,
  },
  overallProgressText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    fontWeight: '500',
  },
  goalCard: {
    margin: 16,
    marginTop: 8,
    backgroundColor: '#ffffff',
    elevation: 2,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  goalTitleSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  statusIcon: {
    margin: 0,
    marginRight: 12,
  },
  goalTextContainer: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  goalDeadline: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 16,
  },
  statusChip: {
    alignSelf: 'flex-start',
    marginBottom: 16,
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
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  remainingText: {
    fontSize: 12,
    color: '#64748b',
  },
  goalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
  emptyCard: {
    margin: 16,
    backgroundColor: '#ffffff',
    elevation: 2,
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    margin: 0,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    color: '#64748b',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: '#10b981',
  },
  addCard: {
    margin: 16,
    backgroundColor: '#ffffff',
    elevation: 2,
  },
  addCardContent: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  addCardText: {
    fontSize: 18,
    color: '#1e293b',
    marginTop: 8,
    fontWeight: '600',
  },
  addCardDescription: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#10b981',
    minWidth: 200,
  },
  modalContainer: {
    margin: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 20,
    lineHeight: 20,
  },
  input: {
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  flexInput: {
    flex: 3,
  },
  unitInput: {
    flex: 1,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 4,
  },
});