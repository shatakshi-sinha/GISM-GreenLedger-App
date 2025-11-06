import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Alert,
  Dimensions 
} from 'react-native';
import { 
  Card, 
  Title, 
  Paragraph, 
  Chip, 
  Button,
  Searchbar,
  ProgressBar,
  IconButton,
  Modal,
  Portal,
  Provider,
  TextInput,
  Menu,
  Divider,
  SegmentedButtons
} from 'react-native-paper';
import { Colors } from '../../constants/Colors';

const { width: screenWidth } = Dimensions.get('window');

interface ReductionStrategy {
  id: string;
  title: string;
  category: string;
  difficulty: 'Low' | 'Medium' | 'High';
  impact: 'Low' | 'Medium' | 'High';
  description: string;
  implementationTime: string;
  cost: string;
  status: 'Not Started' | 'In Progress' | 'Completed';
  progress: number;
}

const initialStrategies: ReductionStrategy[] = [
  {
    id: "1",
    title: "Switch to LED Lighting",
    category: "Energy Efficiency",
    difficulty: "Low",
    impact: "Medium",
    description: "Replace all traditional lighting with energy-efficient LED alternatives across all facilities.",
    implementationTime: "1-3 months",
    cost: "Medium",
    status: "In Progress",
    progress: 65
  },
  {
    id: "2",
    title: "Electric Vehicle Fleet",
    category: "Transport",
    difficulty: "High",
    impact: "High",
    description: "Transition company vehicles to electric models. Includes installation of charging stations.",
    implementationTime: "12-18 months",
    cost: "High",
    status: "Not Started",
    progress: 0
  },
  {
    id: "3",
    title: "Solar Panel Installation",
    category: "Renewable Energy",
    difficulty: "Medium",
    impact: "High",
    description: "Install solar panels on facility rooftops to generate renewable energy.",
    implementationTime: "6-9 months",
    cost: "High",
    status: "Completed",
    progress: 100
  }
];

const categories = ['All', 'Energy Efficiency', 'Transport', 'Renewable Energy', 'Waste Management', 'Digital Transformation'];
const difficulties = ['All', 'Low', 'Medium', 'High'];
const impacts = ['All', 'Low', 'Medium', 'High'];
const statuses = ['All', 'Not Started', 'In Progress', 'Completed'];

export default function Strategies() {
  const [strategies, setStrategies] = useState<ReductionStrategy[]>(initialStrategies);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedImpact, setSelectedImpact] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [modalVisible, setModalVisible] = useState(false);
  const [progressModalVisible, setProgressModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState<string>('');
  const [selectedStrategy, setSelectedStrategy] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [newStrategy, setNewStrategy] = useState({
    title: '',
    category: 'Energy Efficiency',
    difficulty: 'Medium' as 'Low' | 'Medium' | 'High',
    impact: 'Medium' as 'Low' | 'Medium' | 'High',
    description: '',
    implementationTime: '',
    cost: 'Medium'
  });

  const [progressValue, setProgressValue] = useState('');

  // Filter strategies
  const filteredStrategies = strategies.filter(strategy => {
    const matchesSearch = strategy.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         strategy.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || strategy.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || strategy.difficulty === selectedDifficulty;
    const matchesImpact = selectedImpact === 'All' || strategy.impact === selectedImpact;
    const matchesStatus = selectedStatus === 'All' || strategy.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesDifficulty && matchesImpact && matchesStatus;
  });

  // Color getters
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High': return Colors.success;
      case 'Medium': return Colors.warning;
      case 'Low': return Colors.info;
      default: return Colors.textTertiary;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'High': return Colors.error;
      case 'Medium': return Colors.warning;
      case 'Low': return Colors.success;
      default: return Colors.textTertiary;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return Colors.success;
      case 'In Progress': return Colors.info;
      case 'Not Started': return Colors.textTertiary;
      default: return Colors.textTertiary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed': return 'check-circle';
      case 'In Progress': return 'progress-clock';
      case 'Not Started': return 'clock-outline';
      default: return 'circle-outline';
    }
  };

  // Action handlers
  const handleAddStrategy = () => {
    if (!newStrategy.title.trim() || !newStrategy.description.trim() || !newStrategy.implementationTime.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const strategy: ReductionStrategy = {
      id: Date.now().toString(),
      title: newStrategy.title,
      category: newStrategy.category,
      difficulty: newStrategy.difficulty,
      impact: newStrategy.impact,
      description: newStrategy.description,
      implementationTime: newStrategy.implementationTime,
      cost: newStrategy.cost,
      status: 'Not Started',
      progress: 0
    };

    setStrategies([...strategies, strategy]);
    setNewStrategy({
      title: '',
      category: 'Energy Efficiency',
      difficulty: 'Medium',
      impact: 'Medium',
      description: '',
      implementationTime: '',
      cost: 'Medium'
    });
    setModalVisible(false);
    Alert.alert('Success', 'Strategy added successfully!');
  };

  const handleUpdateProgress = () => {
    if (!progressValue.trim()) {
      Alert.alert('Error', 'Please enter progress percentage');
      return;
    }

    const progress = parseInt(progressValue);
    if (isNaN(progress) || progress < 0 || progress > 100) {
      Alert.alert('Error', 'Please enter a valid progress percentage (0-100)');
      return;
    }

    const status = progress === 0 ? 'Not Started' : 
                  progress === 100 ? 'Completed' : 'In Progress';

    setStrategies(prev => prev.map(strategy => 
      strategy.id === selectedStrategy 
        ? { ...strategy, progress, status }
        : strategy
    ));

    setProgressModalVisible(false);
    setProgressValue('');
    Alert.alert('Success', 'Progress updated successfully!');
  };

  const handleDeleteStrategy = () => {
    setStrategies(prev => prev.filter(strategy => strategy.id !== selectedStrategy));
    setDeleteModalVisible(false);
    setMenuVisible('');
    Alert.alert('Success', 'Strategy deleted successfully!');
  };

  const startStrategy = (strategyId: string) => {
    setStrategies(prev => prev.map(strategy => 
      strategy.id === strategyId 
        ? { ...strategy, status: 'In Progress', progress: 5 }
        : strategy
    ));
    setMenuVisible('');
    Alert.alert('Started', 'Strategy implementation started!');
  };

  const completeStrategy = (strategyId: string) => {
    setStrategies(prev => prev.map(strategy => 
      strategy.id === strategyId 
        ? { ...strategy, status: 'Completed', progress: 100 }
        : strategy
    ));
    setMenuVisible('');
    Alert.alert('Completed', 'Strategy marked as completed!');
  };

  const openProgressModal = (strategyId: string) => {
    const strategy = strategies.find(s => s.id === strategyId);
    if (strategy) {
      setSelectedStrategy(strategyId);
      setProgressValue(strategy.progress.toString());
      setProgressModalVisible(true);
      setMenuVisible('');
    }
  };

  const openDeleteModal = (strategyId: string) => {
    setSelectedStrategy(strategyId);
    setDeleteModalVisible(true);
    setMenuVisible('');
  };

  return (
    <Provider>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header Card */}
        <Card style={styles.headerCard}>
          <Card.Content>
            <View style={styles.headerContent}>
              <View>
                <Title style={styles.headerTitle}>Reduction Strategies</Title>
                <Paragraph style={styles.headerSubtitle}>
                  Implement carbon reduction strategies to achieve sustainability goals
                </Paragraph>
              </View>
              <Button 
                mode="contained" 
                icon="plus"
                onPress={() => setModalVisible(true)}
              >
                Add Strategy
              </Button>
            </View>
          </Card.Content>
        </Card>

        {/* Strategies List */}
        {filteredStrategies.map((strategy) => (
          <Card key={strategy.id} style={styles.strategyCard}>
            <Card.Content>
              <View style={styles.strategyHeader}>
                <View style={styles.strategyTitleSection}>
                  <IconButton
                    icon={getStatusIcon(strategy.status)}
                    size={20}
                    iconColor={getStatusColor(strategy.status)}
                  />
                  <View style={styles.strategyTextContent}>
                    <Title style={styles.strategyTitle}>{strategy.title}</Title>
                    <Paragraph style={styles.strategyCategory}>{strategy.category}</Paragraph>
                  </View>
                </View>
                
                {/* Fixed Menu Component */}
                <Menu
                  visible={menuVisible === strategy.id}
                  onDismiss={() => setMenuVisible('')}
                  anchor={
                    <IconButton
                      icon="dots-vertical"
                      size={20}
                      onPress={() => setMenuVisible(strategy.id)}
                    />
                  }
                >
                  {strategy.status !== 'In Progress' && strategy.status !== 'Completed' && (
                    <Menu.Item 
                      leadingIcon="play" 
                      onPress={() => startStrategy(strategy.id)} 
                      title="Start Implementation" 
                    />
                  )}
                  {strategy.status === 'In Progress' && (
                    <Menu.Item 
                      leadingIcon="check" 
                      onPress={() => completeStrategy(strategy.id)} 
                      title="Mark Complete" 
                    />
                  )}
                  <Menu.Item 
                    leadingIcon="chart-line" 
                    onPress={() => openProgressModal(strategy.id)} 
                    title="Update Progress" 
                  />
                  <Menu.Item 
                    leadingIcon="pencil" 
                    onPress={() => Alert.alert('Edit', `Edit ${strategy.title}`)} 
                    title="Edit Strategy" 
                  />
                  <Divider />
                  <Menu.Item 
                    leadingIcon="delete" 
                    onPress={() => openDeleteModal(strategy.id)} 
                    title="Delete" 
                    titleStyle={{ color: Colors.error }}
                  />
                </Menu>
              </View>

              <Paragraph style={styles.strategyDescription}>
                {strategy.description}
              </Paragraph>

              <View style={styles.strategyMeta}>
                <Chip 
                  mode="outlined" 
                  compact 
                  style={[styles.metaChip, { borderColor: getDifficultyColor(strategy.difficulty) }]}
                  textStyle={{ color: getDifficultyColor(strategy.difficulty) }}
                >
                  {strategy.difficulty}
                </Chip>
                <Chip 
                  mode="outlined" 
                  compact 
                  style={[styles.metaChip, { borderColor: getImpactColor(strategy.impact) }]}
                  textStyle={{ color: getImpactColor(strategy.impact) }}
                >
                  {strategy.impact} Impact
                </Chip>
                <Chip 
                  mode="outlined" 
                  compact 
                  style={styles.metaChip}
                >
                  {strategy.cost} Cost
                </Chip>
              </View>

              <View style={styles.progressSection}>
                <View style={styles.progressHeader}>
                  <Text style={styles.progressLabel}>Implementation Progress</Text>
                  <Text style={styles.progressPercentage}>{strategy.progress}%</Text>
                </View>
                <ProgressBar 
                  progress={strategy.progress / 100} 
                  color={getStatusColor(strategy.status)}
                  style={styles.progressBar}
                />
                <Text style={styles.statusText}>{strategy.status}</Text>
              </View>

              <View style={styles.strategyDetails}>
                <View style={styles.detailItem}>
                  <IconButton icon="clock-outline" size={16} />
                  <Text style={styles.detailText}>{strategy.implementationTime}</Text>
                </View>
              </View>

              <View style={styles.strategyActions}>
                <Button 
                  mode="outlined" 
                  style={styles.actionButton}
                  onPress={() => Alert.alert('Details', strategy.description)}
                >
                  View Details
                </Button>
                <Button 
                  mode="contained" 
                  style={styles.actionButton}
                  onPress={() => openProgressModal(strategy.id)}
                >
                  Update Progress
                </Button>
              </View>
            </Card.Content>
          </Card>
        ))}

        {/* Empty State */}
        {filteredStrategies.length === 0 && (
          <Card style={styles.emptyCard}>
            <Card.Content style={styles.emptyContent}>
              <IconButton
                icon="lightbulb-outline"
                size={48}
                iconColor={Colors.textTertiary}
              />
              <Title style={styles.emptyTitle}>No Strategies Found</Title>
              <Paragraph style={styles.emptyText}>
                {searchQuery || selectedCategory !== 'All' 
                  ? 'Try adjusting your search or filters'
                  : 'Create your first reduction strategy to get started'
                }
              </Paragraph>
              <Button 
                mode="contained" 
                icon="plus"
                style={styles.emptyButton}
                onPress={() => setModalVisible(true)}
              >
                Create Strategy
              </Button>
            </Card.Content>
          </Card>
        )}
      </ScrollView>

      {/* Add Strategy Modal */}
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Card>
            <Card.Content>
              <Title style={styles.modalTitle}>Add New Strategy</Title>
              
              <TextInput
                label="Strategy Title *"
                value={newStrategy.title}
                onChangeText={(text) => setNewStrategy(prev => ({ ...prev, title: text }))}
                style={styles.input}
                mode="outlined"
              />

              <TextInput
                label="Description *"
                value={newStrategy.description}
                onChangeText={(text) => setNewStrategy(prev => ({ ...prev, description: text }))}
                style={styles.input}
                mode="outlined"
                multiline
                numberOfLines={3}
              />

              <TextInput
                label="Category"
                value={newStrategy.category}
                onChangeText={(text) => setNewStrategy(prev => ({ ...prev, category: text }))}
                style={styles.input}
                mode="outlined"
              />

              <TextInput
                label="Implementation Time *"
                value={newStrategy.implementationTime}
                onChangeText={(text) => setNewStrategy(prev => ({ ...prev, implementationTime: text }))}
                style={styles.input}
                mode="outlined"
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
                  onPress={handleAddStrategy}
                  style={styles.modalButton}
                >
                  Create Strategy
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
              
              <TextInput
                label="Progress Percentage *"
                value={progressValue}
                onChangeText={setProgressValue}
                keyboardType="numeric"
                style={styles.input}
                mode="outlined"
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
              <Title style={styles.modalTitle}>Delete Strategy</Title>
              <Paragraph style={styles.modalSubtitle}>
                Are you sure you want to delete this strategy?
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
                  buttonColor={Colors.error}
                  onPress={handleDeleteStrategy}
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
    backgroundColor: Colors.background,
  },
  headerCard: {
    margin: 16,
    marginBottom: 12,
    backgroundColor: Colors.surface,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  strategyCard: {
    margin: 16,
    marginTop: 0,
    backgroundColor: Colors.surface,
  },
  strategyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  strategyTitleSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  strategyTextContent: {
    flex: 1,
    marginLeft: 8,
  },
  strategyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  strategyCategory: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  strategyDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  strategyMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  metaChip: {
    height: 32,
  },
  progressSection: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 12,
    color: Colors.textTertiary,
    textAlign: 'center',
  },
  strategyDetails: {
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    color: Colors.textTertiary,
    marginLeft: -8,
  },
  strategyActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
  emptyCard: {
    margin: 16,
    backgroundColor: Colors.surface,
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 20,
    color: Colors.textTertiary,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textTertiary,
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: Colors.primary,
  },
  modalContainer: {
    margin: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 20,
  },
  input: {
    marginBottom: 16,
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