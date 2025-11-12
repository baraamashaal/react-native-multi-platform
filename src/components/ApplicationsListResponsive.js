import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { mockApplications } from '../data/mockData';
import { useResponsive } from '../utils/useResponsive';

/**
 * CHALLENGE #21: Responsive Design in React Native Web
 *
 * Making the data table responsive requires:
 * 1. Using Dimensions API + JavaScript (no CSS media queries)
 * 2. Conditional rendering based on screen size
 * 3. Different layouts for mobile/tablet/desktop
 * 4. Re-renders on every window resize
 * 5. Much more code than CSS @media queries
 *
 * Compare this file to a web solution with CSS Grid + media queries!
 */

const ApplicationsListResponsive = ({ onEdit, onDelete }) => {
  const [applications] = useState(mockApplications);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filterStatus, setFilterStatus] = useState('all');

  // CHALLENGE: Must use JavaScript hook instead of CSS media queries
  const { isMobile, isTablet, isDesktop, width } = useResponsive();

  const sortedAndFilteredData = useMemo(() => {
    let filtered = applications;
    if (filterStatus !== 'all') {
      filtered = filtered.filter(app => app.status === filterStatus);
    }

    const sorted = [...filtered].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      return sortDirection === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
    });

    return sorted;
  }, [applications, sortField, sortDirection, filterStatus]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedAndFilteredData.slice(startIndex, endIndex);
  }, [sortedAndFilteredData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedAndFilteredData.length / itemsPerPage);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  /**
   * MOBILE VIEW: Card Layout
   * On mobile, we show data as cards instead of table
   */
  const renderMobileCard = ({ item }) => (
    <View style={styles.mobileCard}>
      <View style={styles.mobileCardHeader}>
        <Text style={styles.mobileCardName}>
          {item.firstName} {item.lastName}
        </Text>
        <View style={[
          styles.statusBadge,
          item.status === 'submitted' ? styles.statusSubmitted : styles.statusDraft
        ]}>
          <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.mobileCardBody}>
        <View style={styles.mobileCardRow}>
          <Text style={styles.mobileCardLabel}>Email:</Text>
          <Text style={styles.mobileCardValue} numberOfLines={1}>{item.email}</Text>
        </View>

        <View style={styles.mobileCardRow}>
          <Text style={styles.mobileCardLabel}>Location:</Text>
          <Text style={styles.mobileCardValue}>{item.city}, {item.country}</Text>
        </View>

        <View style={styles.mobileCardRow}>
          <Text style={styles.mobileCardLabel}>Role:</Text>
          <Text style={styles.mobileCardValue}>{item.role}</Text>
        </View>

        <View style={styles.mobileCardRow}>
          <Text style={styles.mobileCardLabel}>Salary:</Text>
          <Text style={styles.mobileCardValue}>${item.salary.toLocaleString()}</Text>
        </View>
      </View>

      <View style={styles.mobileCardActions}>
        <TouchableOpacity style={styles.mobileActionButton} onPress={() => onEdit(item)}>
          <Text style={styles.mobileActionButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.mobileActionButton, styles.mobileDeleteButton]}
          onPress={() => onDelete(item.id)}
        >
          <Text style={styles.mobileActionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  /**
   * TABLET VIEW: Simplified Table
   * Show fewer columns to fit better
   */
  const renderTabletRow = ({ item }) => (
    <View style={styles.tableRow}>
      <View style={[styles.tableCell, { width: width * 0.25 }]}>
        <Text style={styles.cellText} numberOfLines={1}>
          {item.firstName} {item.lastName}
        </Text>
      </View>

      <View style={[styles.tableCell, { width: width * 0.25 }]}>
        <Text style={styles.cellText} numberOfLines={1}>{item.email}</Text>
      </View>

      <View style={[styles.tableCell, { width: width * 0.2 }]}>
        <Text style={styles.cellText} numberOfLines={1}>{item.role}</Text>
      </View>

      <View style={[styles.tableCell, { width: width * 0.15 }]}>
        <View style={[
          styles.statusBadge,
          item.status === 'submitted' ? styles.statusSubmitted : styles.statusDraft
        ]}>
          <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
        </View>
      </View>

      <View style={[styles.tableCell, { width: width * 0.15 }]}>
        <View style={styles.tabletActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onEdit(item)}
          >
            <Text style={styles.actionButtonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => onDelete(item.id)}
          >
            <Text style={styles.actionButtonText}>Del</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  /**
   * DESKTOP VIEW: Full Table
   * Show all columns
   */
  const renderDesktopRow = ({ item }) => (
    <View style={styles.tableRow}>
      <View style={[styles.tableCell, styles.cellId]}>
        <Text style={styles.cellText}>{item.id}</Text>
      </View>

      <View style={[styles.tableCell, styles.cellName]}>
        <Text style={styles.cellText} numberOfLines={1}>
          {item.firstName} {item.lastName}
        </Text>
      </View>

      <View style={[styles.tableCell, styles.cellEmail]}>
        <Text style={styles.cellText} numberOfLines={1}>{item.email}</Text>
      </View>

      <View style={[styles.tableCell, styles.cellLocation]}>
        <Text style={styles.cellText} numberOfLines={1}>
          {item.city}, {item.country}
        </Text>
      </View>

      <View style={[styles.tableCell, styles.cellRole]}>
        <Text style={styles.cellText} numberOfLines={1}>{item.role}</Text>
      </View>

      <View style={[styles.tableCell, styles.cellSalary]}>
        <Text style={styles.cellText}>${item.salary.toLocaleString()}</Text>
      </View>

      <View style={[styles.tableCell, styles.cellStatus]}>
        <View style={[
          styles.statusBadge,
          item.status === 'submitted' ? styles.statusSubmitted : styles.statusDraft
        ]}>
          <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
        </View>
      </View>

      <View style={[styles.tableCell, styles.cellActions]}>
        <TouchableOpacity style={styles.actionButton} onPress={() => onEdit(item)}>
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => onDelete(item.id)}
        >
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // CHALLENGE: Must manually choose which renderer to use
  const renderItem = isMobile ? renderMobileCard : (isTablet ? renderTabletRow : renderDesktopRow);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Applications List (Responsive)</Text>
        <Text style={styles.subtitle}>
          {isMobile ? '📱 Mobile' : isTablet ? '📱 Tablet' : '💻 Desktop'} View - Width: {Math.round(width)}px
        </Text>
        <Text style={styles.subtitle}>
          Total: {sortedAndFilteredData.length} applications
        </Text>
      </View>

      {/* Filters - Responsive layout */}
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Filter by status:</Text>
        <View style={[
          styles.filterButtons,
          isMobile && styles.filterButtonsMobile
        ]}>
          {['all', 'submitted', 'draft'].map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.filterButton,
                filterStatus === status && styles.filterButtonActive,
                isMobile && styles.filterButtonMobile
              ]}
              onPress={() => {
                setFilterStatus(status);
                setCurrentPage(1);
              }}
            >
              <Text style={[
                styles.filterButtonText,
                filterStatus === status && styles.filterButtonTextActive
              ]}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* CHALLENGE: Conditional rendering based on screen size */}
      {isMobile ? (
        // Mobile: Card list
        <FlatList
          data={paginatedData}
          renderItem={renderMobileCard}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No applications found</Text>
            </View>
          }
        />
      ) : (
        // Tablet/Desktop: Table
        <View>
          {/* Table Header - Different for tablet vs desktop */}
          {isDesktop && (
            <View style={[styles.tableRow, styles.tableHeader]}>
              <TouchableOpacity
                style={[styles.tableCell, styles.cellId, styles.headerCell]}
                onPress={() => handleSort('id')}
              >
                <Text style={styles.headerText}>ID</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tableCell, styles.cellName, styles.headerCell]}
                onPress={() => handleSort('firstName')}
              >
                <Text style={styles.headerText}>Name</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tableCell, styles.cellEmail, styles.headerCell]}
                onPress={() => handleSort('email')}
              >
                <Text style={styles.headerText}>Email</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tableCell, styles.cellLocation, styles.headerCell]}
                onPress={() => handleSort('country')}
              >
                <Text style={styles.headerText}>Location</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tableCell, styles.cellRole, styles.headerCell]}
                onPress={() => handleSort('role')}
              >
                <Text style={styles.headerText}>Role</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tableCell, styles.cellSalary, styles.headerCell]}
                onPress={() => handleSort('salary')}
              >
                <Text style={styles.headerText}>Salary</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tableCell, styles.cellStatus, styles.headerCell]}
                onPress={() => handleSort('status')}
              >
                <Text style={styles.headerText}>Status</Text>
              </TouchableOpacity>

              <View style={[styles.tableCell, styles.cellActions, styles.headerCell]}>
                <Text style={styles.headerText}>Actions</Text>
              </View>
            </View>
          )}

          {isTablet && (
            <View style={[styles.tableRow, styles.tableHeader]}>
              <TouchableOpacity
                style={[styles.tableCell, { width: width * 0.25 }, styles.headerCell]}
                onPress={() => handleSort('firstName')}
              >
                <Text style={styles.headerText}>Name</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tableCell, { width: width * 0.25 }, styles.headerCell]}
                onPress={() => handleSort('email')}
              >
                <Text style={styles.headerText}>Email</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tableCell, { width: width * 0.2 }, styles.headerCell]}
                onPress={() => handleSort('role')}
              >
                <Text style={styles.headerText}>Role</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tableCell, { width: width * 0.15 }, styles.headerCell]}
                onPress={() => handleSort('status')}
              >
                <Text style={styles.headerText}>Status</Text>
              </TouchableOpacity>

              <View style={[styles.tableCell, { width: width * 0.15 }, styles.headerCell]}>
                <Text style={styles.headerText}>Actions</Text>
              </View>
            </View>
          )}

          <FlatList
            data={paginatedData}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No applications found</Text>
              </View>
            }
          />
        </View>
      )}

      {/* Pagination - Responsive */}
      {totalPages > 1 && (
        <View style={[
          styles.paginationContainer,
          isMobile && styles.paginationContainerMobile
        ]}>
          <TouchableOpacity
            style={[
              styles.paginationButton,
              currentPage === 1 && styles.paginationButtonDisabled,
              isMobile && styles.paginationButtonMobile
            ]}
            onPress={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <Text style={[
              styles.paginationButtonText,
              currentPage === 1 && styles.paginationButtonTextDisabled
            ]}>
              {isMobile ? '←' : 'Previous'}
            </Text>
          </TouchableOpacity>

          <View style={styles.pageNumbers}>
            {[...Array(totalPages)].map((_, index) => (
              <TouchableOpacity
                key={index + 1}
                style={[
                  styles.pageNumber,
                  currentPage === index + 1 && styles.pageNumberActive,
                  isMobile && styles.pageNumberMobile
                ]}
                onPress={() => setCurrentPage(index + 1)}
              >
                <Text style={[
                  styles.pageNumberText,
                  currentPage === index + 1 && styles.pageNumberTextActive
                ]}>
                  {index + 1}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[
              styles.paginationButton,
              currentPage === totalPages && styles.paginationButtonDisabled,
              isMobile && styles.paginationButtonMobile
            ]}
            onPress={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            <Text style={[
              styles.paginationButtonText,
              currentPage === totalPages && styles.paginationButtonTextDisabled
            ]}>
              {isMobile ? '→' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Showing {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, sortedAndFilteredData.length)} of {sortedAndFilteredData.length}
        </Text>
      </View>

      {/* Debug info */}
      <View style={styles.debugBox}>
        <Text style={styles.debugText}>
          💡 Resize your browser to see responsive changes!
        </Text>
        <Text style={styles.debugText}>
          Current breakpoint: {isMobile ? 'Mobile (<768px)' : isTablet ? 'Tablet (768-1024px)' : 'Desktop (>1024px)'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  filterContainer: {
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButtonsMobile: {
    flexDirection: 'column',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
    ...(Platform.OS === 'web' && { cursor: 'pointer' })
  },
  filterButtonMobile: {
    marginBottom: 8,
  },
  filterButtonActive: {
    backgroundColor: '#1976d2',
    borderColor: '#1976d2',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666',
  },
  filterButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },

  // Mobile Card Styles
  mobileCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    ...Platform.select({
      web: {
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
      }
    })
  },
  mobileCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  mobileCardName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  mobileCardBody: {
    marginBottom: 12,
  },
  mobileCardRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  mobileCardLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    width: 80,
  },
  mobileCardValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  mobileCardActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  mobileActionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    backgroundColor: '#1976d2',
    alignItems: 'center',
    ...(Platform.OS === 'web' && { cursor: 'pointer' })
  },
  mobileDeleteButton: {
    backgroundColor: '#d32f2f',
  },
  mobileActionButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },

  // Table Styles
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    minHeight: 48,
    alignItems: 'center',
  },
  tableHeader: {
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 2,
    borderBottomColor: '#ddd',
  },
  tableCell: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    justifyContent: 'center',
  },
  headerCell: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    ...(Platform.OS === 'web' && { cursor: 'pointer' })
  },
  headerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  cellText: {
    fontSize: 14,
    color: '#333',
  },

  // Desktop column widths
  cellId: { width: 60 },
  cellName: { width: 150 },
  cellEmail: { width: 200 },
  cellLocation: { width: 180 },
  cellRole: { width: 150 },
  cellSalary: { width: 120 },
  cellStatus: { width: 100 },
  cellActions: { width: 160 },

  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  statusSubmitted: {
    backgroundColor: '#4caf50',
  },
  statusDraft: {
    backgroundColor: '#ff9800',
  },
  statusText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    backgroundColor: '#1976d2',
    marginRight: 8,
    ...(Platform.OS === 'web' && { cursor: 'pointer' })
  },
  deleteButton: {
    backgroundColor: '#d32f2f',
  },
  actionButtonText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  tabletActions: {
    flexDirection: 'row',
  },

  // Pagination
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    gap: 12,
  },
  paginationContainerMobile: {
    gap: 8,
  },
  paginationButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#1976d2',
    ...(Platform.OS === 'web' && { cursor: 'pointer' })
  },
  paginationButtonMobile: {
    paddingHorizontal: 12,
  },
  paginationButtonDisabled: {
    backgroundColor: '#ddd',
  },
  paginationButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  paginationButtonTextDisabled: {
    color: '#999',
  },
  pageNumbers: {
    flexDirection: 'row',
    gap: 8,
  },
  pageNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    ...(Platform.OS === 'web' && { cursor: 'pointer' })
  },
  pageNumberMobile: {
    width: 32,
    height: 32,
  },
  pageNumberActive: {
    backgroundColor: '#1976d2',
    borderColor: '#1976d2',
  },
  pageNumberText: {
    fontSize: 14,
    color: '#333',
  },
  pageNumberTextActive: {
    color: '#fff',
    fontWeight: '600',
  },

  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  footer: {
    marginTop: 12,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#666',
  },
  debugBox: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
  },
  debugText: {
    fontSize: 12,
    color: '#1976d2',
    marginBottom: 4,
  },
});

export default ApplicationsListResponsive;

/**
 * COMPARISON TO WEB CSS:
 *
 * Web version (simple):
 * -------------------
 * @media (max-width: 768px) {
 *   .table { display: none; }
 *   .card-view { display: block; }
 * }
 *
 * React Native Web (complex):
 * --------------------------
 * - Import useResponsive hook
 * - Add state for dimensions
 * - Conditional rendering everywhere
 * - Multiple render functions
 * - Manual breakpoint management
 * - Re-renders on every resize
 * - 500+ lines of code!
 *
 * Web CSS: 10 lines
 * React Native: 500+ lines
 *
 * That's a 50x difference!
 */
