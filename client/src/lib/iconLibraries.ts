/**
 * Comprehensive Icon Libraries for Enterprise Diagramming
 * Includes AWS, Azure, GCP, Generic Apps, and Network symbols
 */

import {
  Server, Database, Cloud, Box, HardDrive, Workflow,
  GitBranch, User, Globe, Smartphone, Zap, Network,
  Code, Shield, Lock, Key, Mail, Bell, MessageSquare,
  FileText, Folder, Package, Container, Cpu, HardDriveDownload,
  HardDriveUpload, Wifi, Radio, Layers, Share2, Users,
  UserPlus, Settings, Activity, BarChart3, PieChart, TrendingUp,
  Calendar, Clock, Timer, Play, Pause, Square, Circle,
  Triangle, CheckCircle, XCircle, AlertCircle, Info,
  Search, Filter, Download, Upload, RefreshCw, RotateCw,
  ArrowRight, ArrowLeft, ArrowUp, ArrowDown, Maximize2,
  Minimize2, Copy, Trash2, Edit, Eye, EyeOff, Plus, Minus, FolderOpen,
  type LucideIcon
} from 'lucide-react';

export interface IconDefinition {
  id: string;
  name: string;
  icon: LucideIcon;
  category: string;
  tags: string[];
  provider?: 'aws' | 'azure' | 'gcp' | 'generic' | 'network';
  color?: string;
}

// ===== AWS SERVICES =====
export const awsIcons: IconDefinition[] = [
  // Compute
  { id: 'aws-ec2', name: 'EC2', icon: Server, category: 'compute', tags: ['server', 'instance', 'vm'], provider: 'aws', color: '#FF9900' },
  { id: 'aws-lambda', name: 'Lambda', icon: Zap, category: 'compute', tags: ['serverless', 'function'], provider: 'aws', color: '#FF9900' },
  { id: 'aws-ecs', name: 'ECS', icon: Container, category: 'compute', tags: ['container', 'docker'], provider: 'aws', color: '#FF9900' },
  { id: 'aws-eks', name: 'EKS', icon: Box, category: 'compute', tags: ['kubernetes', 'k8s'], provider: 'aws', color: '#FF9900' },
  { id: 'aws-fargate', name: 'Fargate', icon: Layers, category: 'compute', tags: ['serverless', 'container'], provider: 'aws', color: '#FF9900' },
  { id: 'aws-batch', name: 'Batch', icon: Package, category: 'compute', tags: ['batch', 'jobs'], provider: 'aws', color: '#FF9900' },

  // Storage
  { id: 'aws-s3', name: 'S3', icon: HardDrive, category: 'storage', tags: ['object', 'bucket'], provider: 'aws', color: '#569A31' },
  { id: 'aws-ebs', name: 'EBS', icon: HardDriveDownload, category: 'storage', tags: ['block', 'volume'], provider: 'aws', color: '#569A31' },
  { id: 'aws-efs', name: 'EFS', icon: Folder, category: 'storage', tags: ['file', 'shared'], provider: 'aws', color: '#569A31' },
  { id: 'aws-glacier', name: 'Glacier', icon: Database, category: 'storage', tags: ['archive', 'backup'], provider: 'aws', color: '#569A31' },

  // Database
  { id: 'aws-rds', name: 'RDS', icon: Database, category: 'database', tags: ['relational', 'sql'], provider: 'aws', color: '#527FFF' },
  { id: 'aws-dynamodb', name: 'DynamoDB', icon: Database, category: 'database', tags: ['nosql', 'key-value'], provider: 'aws', color: '#527FFF' },
  { id: 'aws-elasticache', name: 'ElastiCache', icon: Zap, category: 'database', tags: ['cache', 'redis', 'memcached'], provider: 'aws', color: '#527FFF' },
  { id: 'aws-redshift', name: 'Redshift', icon: Database, category: 'database', tags: ['warehouse', 'analytics'], provider: 'aws', color: '#527FFF' },
  { id: 'aws-neptune', name: 'Neptune', icon: Network, category: 'database', tags: ['graph', 'relationships'], provider: 'aws', color: '#527FFF' },
  { id: 'aws-documentdb', name: 'DocumentDB', icon: FileText, category: 'database', tags: ['document', 'mongodb'], provider: 'aws', color: '#527FFF' },

  // Networking
  { id: 'aws-vpc', name: 'VPC', icon: Network, category: 'networking', tags: ['network', 'private'], provider: 'aws', color: '#8C4FFF' },
  { id: 'aws-alb', name: 'ALB', icon: Share2, category: 'networking', tags: ['load balancer', 'application'], provider: 'aws', color: '#8C4FFF' },
  { id: 'aws-nlb', name: 'NLB', icon: Network, category: 'networking', tags: ['load balancer', 'network'], provider: 'aws', color: '#8C4FFF' },
  { id: 'aws-cloudfront', name: 'CloudFront', icon: Globe, category: 'networking', tags: ['cdn', 'distribution'], provider: 'aws', color: '#8C4FFF' },
  { id: 'aws-route53', name: 'Route 53', icon: Network, category: 'networking', tags: ['dns', 'routing'], provider: 'aws', color: '#8C4FFF' },
  { id: 'aws-api-gateway', name: 'API Gateway', icon: Code, category: 'networking', tags: ['api', 'rest', 'websocket'], provider: 'aws', color: '#8C4FFF' },

  // Security
  { id: 'aws-iam', name: 'IAM', icon: Shield, category: 'security', tags: ['identity', 'access'], provider: 'aws', color: '#DD344C' },
  { id: 'aws-cognito', name: 'Cognito', icon: UserPlus, category: 'security', tags: ['authentication', 'users'], provider: 'aws', color: '#DD344C' },
  { id: 'aws-kms', name: 'KMS', icon: Key, category: 'security', tags: ['encryption', 'keys'], provider: 'aws', color: '#DD344C' },
  { id: 'aws-secrets', name: 'Secrets Manager', icon: Lock, category: 'security', tags: ['secrets', 'credentials'], provider: 'aws', color: '#DD344C' },
  { id: 'aws-waf', name: 'WAF', icon: Shield, category: 'security', tags: ['firewall', 'protection'], provider: 'aws', color: '#DD344C' },

  // Application Services
  { id: 'aws-sqs', name: 'SQS', icon: GitBranch, category: 'application', tags: ['queue', 'messaging'], provider: 'aws', color: '#FF4F8B' },
  { id: 'aws-sns', name: 'SNS', icon: Bell, category: 'application', tags: ['notification', 'pub/sub'], provider: 'aws', color: '#FF4F8B' },
  { id: 'aws-eventbridge', name: 'EventBridge', icon: Workflow, category: 'application', tags: ['events', 'bus'], provider: 'aws', color: '#FF4F8B' },
  { id: 'aws-step-functions', name: 'Step Functions', icon: Workflow, category: 'application', tags: ['orchestration', 'workflow'], provider: 'aws', color: '#FF4F8B' },

  // Analytics
  { id: 'aws-kinesis', name: 'Kinesis', icon: Activity, category: 'analytics', tags: ['streaming', 'real-time'], provider: 'aws', color: '#00D1B2' },
  { id: 'aws-athena', name: 'Athena', icon: Search, category: 'analytics', tags: ['query', 'sql'], provider: 'aws', color: '#00D1B2' },
  { id: 'aws-glue', name: 'Glue', icon: Layers, category: 'analytics', tags: ['etl', 'data'], provider: 'aws', color: '#00D1B2' },
  { id: 'aws-emr', name: 'EMR', icon: BarChart3, category: 'analytics', tags: ['hadoop', 'spark'], provider: 'aws', color: '#00D1B2' },

  // Management
  { id: 'aws-cloudwatch', name: 'CloudWatch', icon: Activity, category: 'management', tags: ['monitoring', 'logs'], provider: 'aws', color: '#FF9900' },
  { id: 'aws-cloudformation', name: 'CloudFormation', icon: FileText, category: 'management', tags: ['iac', 'template'], provider: 'aws', color: '#FF9900' },
  { id: 'aws-systems-manager', name: 'Systems Manager', icon: Settings, category: 'management', tags: ['operations', 'automation'], provider: 'aws', color: '#FF9900' },
];

// ===== AZURE SERVICES =====
export const azureIcons: IconDefinition[] = [
  // Compute
  { id: 'azure-vm', name: 'Virtual Machines', icon: Server, category: 'compute', tags: ['server', 'vm'], provider: 'azure', color: '#0078D4' },
  { id: 'azure-functions', name: 'Functions', icon: Zap, category: 'compute', tags: ['serverless', 'function'], provider: 'azure', color: '#0078D4' },
  { id: 'azure-aks', name: 'AKS', icon: Box, category: 'compute', tags: ['kubernetes', 'container'], provider: 'azure', color: '#0078D4' },
  { id: 'azure-container-instances', name: 'Container Instances', icon: Container, category: 'compute', tags: ['container', 'docker'], provider: 'azure', color: '#0078D4' },
  { id: 'azure-app-service', name: 'App Service', icon: Globe, category: 'compute', tags: ['web', 'app'], provider: 'azure', color: '#0078D4' },
  { id: 'azure-batch', name: 'Batch', icon: Package, category: 'compute', tags: ['batch', 'jobs'], provider: 'azure', color: '#0078D4' },

  // Storage
  { id: 'azure-storage', name: 'Storage Account', icon: HardDrive, category: 'storage', tags: ['blob', 'file', 'object'], provider: 'azure', color: '#00BCF2' },
  { id: 'azure-blob', name: 'Blob Storage', icon: Database, category: 'storage', tags: ['object', 'blob'], provider: 'azure', color: '#00BCF2' },
  { id: 'azure-files', name: 'Files', icon: Folder, category: 'storage', tags: ['file', 'shared'], provider: 'azure', color: '#00BCF2' },
  { id: 'azure-disk', name: 'Managed Disks', icon: HardDriveDownload, category: 'storage', tags: ['disk', 'volume'], provider: 'azure', color: '#00BCF2' },

  // Database
  { id: 'azure-sql', name: 'SQL Database', icon: Database, category: 'database', tags: ['sql', 'relational'], provider: 'azure', color: '#0078D4' },
  { id: 'azure-cosmos', name: 'Cosmos DB', icon: Database, category: 'database', tags: ['nosql', 'global'], provider: 'azure', color: '#0078D4' },
  { id: 'azure-cache', name: 'Cache for Redis', icon: Zap, category: 'database', tags: ['cache', 'redis'], provider: 'azure', color: '#0078D4' },
  { id: 'azure-postgresql', name: 'PostgreSQL', icon: Database, category: 'database', tags: ['postgres', 'sql'], provider: 'azure', color: '#0078D4' },
  { id: 'azure-mysql', name: 'MySQL', icon: Database, category: 'database', tags: ['mysql', 'sql'], provider: 'azure', color: '#0078D4' },

  // Networking
  { id: 'azure-vnet', name: 'Virtual Network', icon: Network, category: 'networking', tags: ['network', 'vnet'], provider: 'azure', color: '#7FBA00' },
  { id: 'azure-lb', name: 'Load Balancer', icon: Share2, category: 'networking', tags: ['load balancer', 'lb'], provider: 'azure', color: '#7FBA00' },
  { id: 'azure-cdn', name: 'CDN', icon: Globe, category: 'networking', tags: ['cdn', 'distribution'], provider: 'azure', color: '#7FBA00' },
  { id: 'azure-dns', name: 'DNS', icon: Network, category: 'networking', tags: ['dns', 'routing'], provider: 'azure', color: '#7FBA00' },
  { id: 'azure-application-gateway', name: 'Application Gateway', icon: Code, category: 'networking', tags: ['gateway', 'waf'], provider: 'azure', color: '#7FBA00' },

  // Security
  { id: 'azure-ad', name: 'Active Directory', icon: FolderOpen, category: 'security', tags: ['identity', 'authentication'], provider: 'azure', color: '#0078D4' },
  { id: 'azure-key-vault', name: 'Key Vault', icon: Key, category: 'security', tags: ['secrets', 'keys'], provider: 'azure', color: '#0078D4' },
  { id: 'azure-security-center', name: 'Security Center', icon: Shield, category: 'security', tags: ['security', 'protection'], provider: 'azure', color: '#0078D4' },

  // Integration
  { id: 'azure-service-bus', name: 'Service Bus', icon: GitBranch, category: 'integration', tags: ['messaging', 'queue'], provider: 'azure', color: '#59B4D9' },
  { id: 'azure-event-hub', name: 'Event Hub', icon: Workflow, category: 'integration', tags: ['events', 'streaming'], provider: 'azure', color: '#59B4D9' },
  { id: 'azure-logic-apps', name: 'Logic Apps', icon: Workflow, category: 'integration', tags: ['workflow', 'automation'], provider: 'azure', color: '#59B4D9' },

  // Monitoring
  { id: 'azure-monitor', name: 'Monitor', icon: Activity, category: 'monitoring', tags: ['monitoring', 'observability'], provider: 'azure', color: '#0078D4' },
  { id: 'azure-log-analytics', name: 'Log Analytics', icon: FileText, category: 'monitoring', tags: ['logs', 'analytics'], provider: 'azure', color: '#0078D4' },
];

// ===== GCP SERVICES =====
export const gcpIcons: IconDefinition[] = [
  // Compute
  { id: 'gcp-compute-engine', name: 'Compute Engine', icon: Server, category: 'compute', tags: ['vm', 'instance'], provider: 'gcp', color: '#4285F4' },
  { id: 'gcp-cloud-functions', name: 'Cloud Functions', icon: Zap, category: 'compute', tags: ['serverless', 'function'], provider: 'gcp', color: '#4285F4' },
  { id: 'gcp-gke', name: 'GKE', icon: Box, category: 'compute', tags: ['kubernetes', 'container'], provider: 'gcp', color: '#4285F4' },
  { id: 'gcp-cloud-run', name: 'Cloud Run', icon: Container, category: 'compute', tags: ['container', 'serverless'], provider: 'gcp', color: '#4285F4' },
  { id: 'gcp-app-engine', name: 'App Engine', icon: Globe, category: 'compute', tags: ['paas', 'web'], provider: 'gcp', color: '#4285F4' },

  // Storage
  { id: 'gcp-cloud-storage', name: 'Cloud Storage', icon: HardDrive, category: 'storage', tags: ['object', 'bucket'], provider: 'gcp', color: '#EA4335' },
  { id: 'gcp-filestore', name: 'Filestore', icon: Folder, category: 'storage', tags: ['file', 'nfs'], provider: 'gcp', color: '#EA4335' },
  { id: 'gcp-persistent-disk', name: 'Persistent Disk', icon: HardDriveDownload, category: 'storage', tags: ['disk', 'block'], provider: 'gcp', color: '#EA4335' },

  // Database
  { id: 'gcp-cloud-sql', name: 'Cloud SQL', icon: Database, category: 'database', tags: ['sql', 'relational'], provider: 'gcp', color: '#FBBC04' },
  { id: 'gcp-firestore', name: 'Firestore', icon: Database, category: 'database', tags: ['nosql', 'document'], provider: 'gcp', color: '#FBBC04' },
  { id: 'gcp-bigtable', name: 'Bigtable', icon: Database, category: 'database', tags: ['nosql', 'wide-column'], provider: 'gcp', color: '#FBBC04' },
  { id: 'gcp-spanner', name: 'Cloud Spanner', icon: Database, category: 'database', tags: ['sql', 'distributed'], provider: 'gcp', color: '#FBBC04' },
  { id: 'gcp-memorystore', name: 'Memorystore', icon: Zap, category: 'database', tags: ['cache', 'redis'], provider: 'gcp', color: '#FBBC04' },

  // Networking
  { id: 'gcp-vpc', name: 'VPC', icon: Network, category: 'networking', tags: ['network', 'vpc'], provider: 'gcp', color: '#34A853' },
  { id: 'gcp-load-balancer', name: 'Load Balancer', icon: Share2, category: 'networking', tags: ['load balancer', 'lb'], provider: 'gcp', color: '#34A853' },
  { id: 'gcp-cdn', name: 'Cloud CDN', icon: Globe, category: 'networking', tags: ['cdn', 'distribution'], provider: 'gcp', color: '#34A853' },
  { id: 'gcp-dns', name: 'Cloud DNS', icon: Network, category: 'networking', tags: ['dns', 'routing'], provider: 'gcp', color: '#34A853' },
  { id: 'gcp-api-gateway', name: 'API Gateway', icon: Code, category: 'networking', tags: ['api', 'gateway'], provider: 'gcp', color: '#34A853' },

  // Security
  { id: 'gcp-iam', name: 'IAM', icon: Shield, category: 'security', tags: ['identity', 'access'], provider: 'gcp', color: '#4285F4' },
  { id: 'gcp-kms', name: 'Cloud KMS', icon: Key, category: 'security', tags: ['encryption', 'keys'], provider: 'gcp', color: '#4285F4' },
  { id: 'gcp-secret-manager', name: 'Secret Manager', icon: Lock, category: 'security', tags: ['secrets', 'credentials'], provider: 'gcp', color: '#4285F4' },

  // Messaging
  { id: 'gcp-pub-sub', name: 'Pub/Sub', icon: GitBranch, category: 'messaging', tags: ['messaging', 'queue', 'pub/sub'], provider: 'gcp', color: '#4285F4' },

  // Monitoring
  { id: 'gcp-monitoring', name: 'Cloud Monitoring', icon: Activity, category: 'monitoring', tags: ['monitoring', 'observability'], provider: 'gcp', color: '#4285F4' },
  { id: 'gcp-logging', name: 'Cloud Logging', icon: FileText, category: 'monitoring', tags: ['logs', 'logging'], provider: 'gcp', color: '#4285F4' },

  // Analytics
  { id: 'gcp-bigquery', name: 'BigQuery', icon: BarChart3, category: 'analytics', tags: ['warehouse', 'analytics'], provider: 'gcp', color: '#FBBC04' },
  { id: 'gcp-dataflow', name: 'Dataflow', icon: Workflow, category: 'analytics', tags: ['streaming', 'pipeline'], provider: 'gcp', color: '#FBBC04' },
];

// ===== GENERIC APPLICATION ICONS =====
export const genericIcons: IconDefinition[] = [
  // Basic Shapes & Elements
  { id: 'generic-server', name: 'Server', icon: Server, category: 'infrastructure', tags: ['server', 'host'], provider: 'generic' },
  { id: 'generic-database', name: 'Database', icon: Database, category: 'infrastructure', tags: ['database', 'db'], provider: 'generic' },
  { id: 'generic-cloud', name: 'Cloud', icon: Cloud, category: 'infrastructure', tags: ['cloud'], provider: 'generic' },
  { id: 'generic-storage', name: 'Storage', icon: HardDrive, category: 'infrastructure', tags: ['storage', 'disk'], provider: 'generic' },

  // Users & Actors
  { id: 'generic-user', name: 'User', icon: User, category: 'actors', tags: ['user', 'person'], provider: 'generic' },
  { id: 'generic-users', name: 'Users', icon: Users, category: 'actors', tags: ['users', 'group'], provider: 'generic' },
  { id: 'generic-admin', name: 'Admin', icon: Shield, category: 'actors', tags: ['admin', 'administrator'], provider: 'generic' },

  // Interfaces
  { id: 'generic-browser', name: 'Browser', icon: Globe, category: 'interfaces', tags: ['browser', 'web'], provider: 'generic' },
  { id: 'generic-mobile', name: 'Mobile', icon: Smartphone, category: 'interfaces', tags: ['mobile', 'phone'], provider: 'generic' },
  { id: 'generic-api', name: 'API', icon: Code, category: 'interfaces', tags: ['api', 'rest'], provider: 'generic' },

  // Services & Components
  { id: 'generic-service', name: 'Service', icon: Box, category: 'services', tags: ['service', 'microservice'], provider: 'generic' },
  { id: 'generic-function', name: 'Function', icon: Zap, category: 'services', tags: ['function', 'lambda'], provider: 'generic' },
  { id: 'generic-queue', name: 'Queue', icon: GitBranch, category: 'services', tags: ['queue', 'message'], provider: 'generic' },
  { id: 'generic-cache', name: 'Cache', icon: Zap, category: 'services', tags: ['cache', 'memory'], provider: 'generic' },
  { id: 'generic-load-balancer', name: 'Load Balancer', icon: Share2, category: 'services', tags: ['lb', 'load balancer'], provider: 'generic' },

  // Data & Files
  { id: 'generic-file', name: 'File', icon: FileText, category: 'data', tags: ['file', 'document'], provider: 'generic' },
  { id: 'generic-folder', name: 'Folder', icon: Folder, category: 'data', tags: ['folder', 'directory'], provider: 'generic' },
  { id: 'generic-package', name: 'Package', icon: Package, category: 'data', tags: ['package', 'archive'], provider: 'generic' },

  // Communication
  { id: 'generic-email', name: 'Email', icon: Mail, category: 'communication', tags: ['email', 'mail'], provider: 'generic' },
  { id: 'generic-notification', name: 'Notification', icon: Bell, category: 'communication', tags: ['notification', 'alert'], provider: 'generic' },
  { id: 'generic-message', name: 'Message', icon: MessageSquare, category: 'communication', tags: ['message', 'chat'], provider: 'generic' },

  // Security
  { id: 'generic-shield', name: 'Shield', icon: Shield, category: 'security', tags: ['security', 'protection'], provider: 'generic' },
  { id: 'generic-lock', name: 'Lock', icon: Lock, category: 'security', tags: ['lock', 'secure'], provider: 'generic' },
  { id: 'generic-key', name: 'Key', icon: Key, category: 'security', tags: ['key', 'credential'], provider: 'generic' },

  // Monitoring & Analytics
  { id: 'generic-monitoring', name: 'Monitoring', icon: Activity, category: 'monitoring', tags: ['monitoring', 'metrics'], provider: 'generic' },
  { id: 'generic-chart', name: 'Chart', icon: BarChart3, category: 'analytics', tags: ['chart', 'graph'], provider: 'generic' },
  { id: 'generic-trends', name: 'Trends', icon: TrendingUp, category: 'analytics', tags: ['trends', 'analytics'], provider: 'generic' },

  // Network
  { id: 'generic-network', name: 'Network', icon: Network, category: 'networking', tags: ['network'], provider: 'generic' },
  { id: 'generic-wifi', name: 'WiFi', icon: Wifi, category: 'networking', tags: ['wifi', 'wireless'], provider: 'generic' },
  { id: 'generic-router', name: 'Router', icon: Radio, category: 'networking', tags: ['router'], provider: 'generic' },

  // Operations
  { id: 'generic-settings', name: 'Settings', icon: Settings, category: 'operations', tags: ['settings', 'config'], provider: 'generic' },
  { id: 'generic-workflow', name: 'Workflow', icon: Workflow, category: 'operations', tags: ['workflow', 'process'], provider: 'generic' },
  { id: 'generic-timer', name: 'Timer', icon: Timer, category: 'operations', tags: ['timer', 'schedule'], provider: 'generic' },

  // Actions
  { id: 'generic-upload', name: 'Upload', icon: Upload, category: 'actions', tags: ['upload'], provider: 'generic' },
  { id: 'generic-download', name: 'Download', icon: Download, category: 'actions', tags: ['download'], provider: 'generic' },
  { id: 'generic-refresh', name: 'Refresh', icon: RefreshCw, category: 'actions', tags: ['refresh', 'sync'], provider: 'generic' },
];

// ===== NETWORK DIAGRAM ICONS =====
export const networkIcons: IconDefinition[] = [
  { id: 'network-router', name: 'Router', icon: Radio, category: 'network-devices', tags: ['router'], provider: 'network' },
  { id: 'network-switch', name: 'Switch', icon: Network, category: 'network-devices', tags: ['switch'], provider: 'network' },
  { id: 'network-firewall', name: 'Firewall', icon: Shield, category: 'network-security', tags: ['firewall', 'security'], provider: 'network' },
  { id: 'network-vpn', name: 'VPN', icon: Lock, category: 'network-security', tags: ['vpn', 'tunnel'], provider: 'network' },
  { id: 'network-load-balancer', name: 'Load Balancer', icon: Share2, category: 'network-devices', tags: ['load balancer'], provider: 'network' },
  { id: 'network-gateway', name: 'Gateway', icon: ArrowRight, category: 'network-devices', tags: ['gateway'], provider: 'network' },
  { id: 'network-endpoint', name: 'Endpoint', icon: Circle, category: 'network-devices', tags: ['endpoint', 'device'], provider: 'network' },
];

// ===== ALL ICONS COMBINED =====
export const allIcons: IconDefinition[] = [
  ...awsIcons,
  ...azureIcons,
  ...gcpIcons,
  ...genericIcons,
  ...networkIcons,
];

// ===== SEARCH AND FILTER FUNCTIONS =====
export function searchIcons(query: string): IconDefinition[] {
  const lowerQuery = query.toLowerCase();
  return allIcons.filter(icon =>
    icon.name.toLowerCase().includes(lowerQuery) ||
    icon.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
    icon.category.toLowerCase().includes(lowerQuery)
  );
}

export function getIconsByCategory(category: string): IconDefinition[] {
  return allIcons.filter(icon => icon.category === category);
}

export function getIconsByProvider(provider: string): IconDefinition[] {
  return allIcons.filter(icon => icon.provider === provider);
}

export function getIconById(id: string): IconDefinition | undefined {
  return allIcons.find(icon => icon.id === id);
}

// ===== ICON CATEGORIES =====
export const iconCategories = Array.from(new Set(allIcons.map(icon => icon.category)));

export const iconProviders = ['all', 'aws', 'azure', 'gcp', 'generic', 'network'] as const;
