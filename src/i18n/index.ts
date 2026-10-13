import { en } from './en'
import { si } from './si'
import { isPreservedEntity } from './preserved'

export type Language = 'en' | 'si'
export { en, si }
export { isPreservedEntity } from './preserved'

// Helper to flatten nested objects into key-value pairs
function flattenObject(obj: Record<string, any>, prefix = ''): Record<string, string> {
  const result: Record<string, string> = {}
  for (const key of Object.keys(obj)) {
    const val = obj[key]
    const newKey = prefix ? `${prefix}.${key}` : key
    if (typeof val === 'string') {
      result[newKey] = val
    } else if (typeof val === 'object' && val !== null) {
      Object.assign(result, flattenObject(val, newKey))
    }
  }
  return result
}

const flatEn = flattenObject(en)
const flatSi = flattenObject(si)

/**
 * Direct mapping of English string -> Sinhala translation.
 * Built automatically from en & si structures + direct phrase mappings.
 */
export const phraseMap: Record<string, string> = {}

// 1. Populate from structured dictionaries by matching keys
for (const [key, englishStr] of Object.entries(flatEn)) {
  const sinhalaStr = flatSi[key]
  if (sinhalaStr && englishStr) {
    phraseMap[englishStr.trim()] = sinhalaStr.trim()
  }
}

// 2. Comprehensive additional phrase dictionary for all tabs, tables, modals, filters, and cards
const additionalPhrases: Record<string, string> = {
  // Navigation tabs
  'Home': 'මුල් පිටුව',
  'About': 'අප ගැන',
  'Services': 'සේවා',
  'Contact': 'සම්බන්ධ වන්න',
  'Explore map': 'සිතියම බලන්න',
  'Sign in': 'පිවිසෙන්න',
  'Sign out': 'පිටවන්න',
  'Overview': 'සාරාංශය',
  'Municipal map': 'නගර සභා සිතියම',
  'My requests': 'මගේ ඉල්ලීම්',
  'My bookings': 'මගේ වෙන්කිරීම්',
  'My tax payments': 'මගේ බදු ගෙවීම්',
  'Applications': 'අයදුම්පත්',
  'Requests': 'ඉල්ලීම්',
  'Approvals': 'අනුමැතිය',
  'Analytics': 'විශ්ලේෂණ',
  'Tax': 'බදු',
  'Buildings': 'ගොඩනැගිලි',
  'Users': 'පරිශීලකයින්',
  'Notifications': 'දැනුම්දීම්',
  'Workspace': 'වැඩ අවකාශය',
  'Citizen portal': 'පුරවැසි ද්වාරය',
  'Executive command': 'විධායක පාලනය',
  'Government workspace': 'රාජ්‍ය වැඩ අවකාශය',
  'Government portal': 'රාජ්‍ය ද්වාරය',
  'Notices & news': 'නිවේදන සහ පුවත්',

  // Stages & Statuses
  'All': 'සියල්ල',
  'New': 'නව',
  'Review': 'සමාලෝචනය',
  'Assigned': 'පවරා ඇත',
  'Inspecting': 'පරීක්ෂා කරමින්',
  'For approval': 'අනුමැතිය සඳහා',
  'Resolved': 'විසඳා ඇත',
  'Closed': 'වසා ඇත',
  'Pending': 'බලාපොරොත්තු',
  'Approved': 'අනුමතයි',
  'Rejected': 'ප්‍රතික්ෂේපයි',
  'Completed': 'සම්පූර්ණයි',
  'In progress': 'ක්‍රියාත්මකයි',
  'Created': 'සාදන ලදී',
  'Under review': 'සමාලෝචනය වෙමින්',
  'Inspection scheduled': 'පරීක්ෂණය සැලසුම් කර ඇත',
  'Action required': 'ක්‍රියාමාර්ග අවශ්‍යයි',
  'Needs approval': 'අනුමැතිය අවශ්‍යයි',
  'Awaiting approval': 'අනුමැතිය අපේක්ෂාවෙන්',
  'Approval': 'අනුමැතිය',
  'Overdue': 'කල් ඉකුත් වූ',
  'Unassigned': 'නොපැවරූ',
  'Unassigned ward': 'නොපැවරූ කොට්ඨාසය',
  'Mapped location': 'සිතියම්ගත ස්ථානය',
  'Open': 'විවෘතයි',
  'Cancelled': 'අවලංගුයි',
  'Duplicate': 'අනුපිටපතකි',
  'Urgent': 'හදිසි',
  'High': 'ඉහළ',
  'Normal': 'සාමාන්‍ය',
  'Low': 'අඩු',
  'Confirmed': 'තහවුරු කර ඇත',

  // Request Types
  'Complaint': 'පැමිණිල්ල',
  'Inquiry': 'විමසීම',
  'Service': 'සේවාව',
  'Hazard': 'අවදානම',
  'Incident': 'සිදුවීම',
  'Booking': 'වෙන්කිරීම',
  'Application': 'අයදුම්පත',

  // Common buttons and headers
  'New request': 'නව ඉල්ලීම',
  'New booking': 'නව වෙන්කිරීම',
  'Make payment': 'ගෙවීමක් කරන්න',
  'New application': 'නව අයදුම්පත',
  'Search': 'සොයන්න',
  'Filter': 'පෙරහන්',
  'Status': 'තත්ත්වය',
  'Type': 'වර්ගය',
  'Priority': 'ප්‍රමුඛතාව',
  'Location': 'ස්ථානය',
  'Description': 'විස්තරය',
  'Submit': 'ඉදිරිපත් කරන්න',
  'Cancel': 'අවලංගු කරන්න',
  'Close': 'වසන්න',
  'Save': 'සුරකින්න',
  'Update': 'යාවත්කාලීන කරන්න',
  'Delete': 'මකන්න',
  'Edit': 'සංස්කරණය කරන්න',
  'View': 'බලන්න',
  'View request': 'ඉල්ලීම බලන්න',
  'Open request': 'ඉල්ලීම විවෘත කරන්න',
  'Loading...': 'පූරණය වෙමින්...',
  'No results found': 'ප්‍රතිඵල හමු නොවීය',
  'View all': 'සියල්ල බලන්න',
  'Learn more': 'තවත් දැනගන්න',
  'Get started': 'ආරම්භ කරන්න',
  'Receipt': 'රිසිට්පත',
  'Actions': 'ක්‍රියා',
  'Action': 'ක්‍රියාව',
  'Date': 'දිනය',
  'Time': 'වේලාව',
  'Amount': 'මුදල',
  'Reference': 'යොමුව',
  'Name': 'නම',
  'Email': 'විද්‍යුත් තැපෑල',
  'Password': 'මුරපදය',
  'Role': 'භූමිකාව',
  'Department': 'දෙපාර්තමේන්තුව',
  'Facility': 'පහසුකම',
  'Outstanding': 'හිඟ ශේෂය',
  'No overdue balance': 'පසුගිය හිඟ මුදල් නැත',
  'Paid this year': 'මෙම වසරේ ගෙවූ මුදල',
  'Payment history': 'ගෙවීම් ඉතිහාසය',
  'Recent receipts': 'මෑත රිසිට්පත්',
  'Booking history': 'වෙන්කිරීම් ඉතිහාසය',
  'Your applications': 'ඔබගේ අයදුම්පත්',
  'Recent submissions': 'මෑතකදී ඉදිරිපත් කළ අයදුම්පත්',
  'Online applications': 'මාර්ගගත අයදුම්පත්',
  'Municipal services': 'නගර සභා සේවා',
  'Citizen services': 'පුරවැසි සේවා',
  'Citizen finance': 'පුරවැසි මූල්‍ය',
  'Governance': 'රාජ්‍ය පාලනය',
  'Approval center': 'අනුමත කිරීමේ මධ්‍යස්ථානය',
  'Awaiting decision': 'තීරණයක් අපේක්ෂාවෙන්',
  'Oldest request': 'පැරණිතම ඉල්ලීම',
  'Approved this week': 'මෙම සතියේ අනුමත කළ',
  'Review case': 'නඩුව සමාලෝචනය කරන්න',
  'Approve': 'අනුමත කරන්න',
  'Request more info': 'වැඩිදුර තොරතුරු ඉල්ලන්න',
  'Reject': 'ප්‍රතික්ෂේප කරන්න',
  'Executive intelligence': 'විධායක තොරතුරු',
  'Municipal analytics': 'නගර සභා විශ්ලේෂණ',
  'Resolution rate': 'විසඳුම් අනුපාතය',
  'Median resolution': 'සාමාන්‍ය විසඳුම් කාලය',
  'Hotspot wards': 'අධික ඉල්ලුම් කොට්ඨාස',
  'Demand change': 'ඉල්ලුමේ වෙනස්වීම',
  'Weekly throughput': 'සතිපතා ප්‍රගතිය',
  'Opened and resolved requests': 'විවෘත කළ සහ විසඳූ ඉල්ලීම්',
  'Department score': 'දෙපාර්තමේන්තු ලකුණු',
  'Service health': 'සේවා තත්ත්වය',
  'Geographic pressure': 'භූගෝලීය පීඩනය',
  'Request mix': 'ඉල්ලීම් සංයුතිය',
  'By service type': 'සේවා වර්ගය අනුව',
  'Annual target': 'වාර්ෂික ඉලක්කය',
  'Collected': 'එකතු කළ මුදල',
  'YoY collection': 'වසරින් වසර එකතු කිරීම',
  'Monthly collection': 'මාසික එකතු කිරීම',
  'Collection curve': 'එකතු කිරීමේ වක්‍රය',
  'By ward': 'කොට්ඨාසය අනුව',
  'Collection progress': 'එකතු කිරීමේ ප්‍රගතිය',
  'Building registry': 'ගොඩනැගිලි ලේඛනය',
  'Registered parcels': 'ලියාපදිංචි ඉඩම් කොටස්',
  'Commercial': 'වාණිජ',
  'Residential': 'නේවාසික',
  'Government': 'රාජ්‍ය',
  'Religious': 'ආගමික',
  'Mixed-use': 'මිශ්‍ර භාවිත',
  'Industrial': 'කාර්මික',
  'View on map': 'සිතියමේ බලන්න',
  'User management': 'පරිශීලක කළමනාකරණය',
  'Add user': 'පරිශීලකයෙකු එක් කරන්න',
  'All users': 'සියලු පරිශීලකයින්',
  'Citizens': 'පුරවැසියන්',
  'Officers': 'නිලධාරීන්',
  'Admins': 'පරිපාලකයින්',
  'Approvers': 'අනුමත කරන්නන්',
  'Directors': 'අධ්‍යක්ෂවරුන්',
  'Active': 'සක්‍රිය',
  'Suspended': 'අත්හිටුවූ',
  'Inactive': 'අක්‍රිය',
  'Notification center': 'දැනුම්දීම් මධ්‍යස්ථානය',
  'Unread': 'නොකියවූ',
  'Mark all as read': 'සියල්ල කියවූ ලෙස සලකුණු කරන්න',
  'Refresh': 'නැවුම් කරන්න',
  'No notifications found': 'දැනුම්දීම් හමු නොවීය',
  'You’re all caught up.': 'ඔබ සියලු දැනුම්දීම් පරීක්ෂා කර ඇත.',
  'About Spatio LGS': 'Spatio LGS පිළිබඳව',
  'Our approach': 'අපගේ ප්‍රවේශය',
  'One connected picture for every council.': 'සෑම නගර සභාවකටම එක් සම්බන්ධිත දර්ශනයක්.',
  'Send message': 'පණිවිඩයක් එවන්න',
  'Emergency hotline': 'හදිසි ඇමතුම් අංකය',
  'Office hours': 'කාර්යාල වේලාවන්',
  'Email address': 'විද්‍යුත් තැපැල් ලිපිනය',
  'Subject': 'විෂය',
  'Message': 'පණිවිඩය',
  'First name': 'මුල් නම',
  'Last name': 'අවසන් නම',
  'Register': 'ලියාපදිංචි වන්න',
  'Creating account...': 'ගිණුම සාදමින්...',
  'Already registered?': 'දැනටමත් ලියාපදිංචිද?',
  'Continue securely': 'ආරක්ෂිතව ඉදිරියට යන්න',
  'Signing in...': 'පිවිසෙමින්...',
  'Back to Home': 'මුල් පිටුවට',
  'Return to the main website': 'ප්‍රධාන වෙබ් අඩවියට ආපසු යන්න',
  'Open civic map': 'පුරවැසි සිතියම විවෘත කරන්න',
  'Open assigned map': 'පැවරුම් සිතියම විවෘත කරන්න',
  'Municipal network': 'නගර සභා ජාලය',
  'All systems operational': 'සියලු පද්ධති ක්‍රියාත්මකයි',
  'Recent activity': 'මෑත ක්‍රියාකාරකම්',
  'Around you': 'ඔබ අවට',
  'Municipal pulse': 'නගර සභා සක්‍රියතාව',
  'Environmental': 'පාරිසරික',
  'Utilities': 'පොදු උපයෝගිතා',
  'Planning': 'නාගරික සැලසුම්',
  'Explore requests on map': 'සිතියමෙන් ඉල්ලීම් ගවේෂණය කරන්න',
  'Work queue': 'වැඩ පෝලිම',
  'Assigned to you': 'ඔබට පවරා ඇති',
  'Full queue': 'සම්පූර්ණ පෝලිම',
  'Field brief': 'ක්ෂේත්‍ර සාරාංශය',
  'View route context': 'මාර්ග සන්දර්භය බලන්න',
  'Across all service types': 'සියලු සේවා වර්ග හරහා',
  'Currently being handled': 'දැනට විසඳමින් පවතී',
  'Completed by the council': 'සභාව මඟින් සම්පූර්ණ කරන ලදී',
  'Public facilities': 'පොදු පහසුකම්',
  'Active cases in your queue': 'ඔබගේ පෝලිමේ ඇති සක්‍රිය නඩු',
  'Field inspection underway': 'ක්ෂේත්‍ර පරීක්ෂණ ක්‍රියාත්මකයි',
  'High attention required': 'ඉහළ අවධානයක් අවශ්‍යයි',

  // Government Admin & Role Dashboards
  'Municipal operations': 'නාගරික මෙහෙයුම්',
  'Keep the service flow moving.': 'සේවා ප්‍රවාහය අඛණ්ඩව පවත්වා ගන්න.',
  'See new demand, ownership gaps and the work most likely to stall.': 'නව ඉල්ලුම, හිමිකාරීත්ව හිඩැස් සහ ප්‍රමාද වීමට ඉඩ ඇති කටයුතු නිරීක්ෂණය කරන්න.',
  'Open request queue': 'ඉල්ලීම් පෝලිම විවෘත කරන්න',
  'Request velocity': 'ඉල්ලීම් වේගය',
  'Opened vs resolved': 'විවෘත කළ සහ විසඳූ',
  'Live data': 'සජීවී දත්ත',
  'Attention queue': 'අවධානය අවශ්‍ය පෝලිම',
  'Needs ownership': 'හිමිකාරිත්වය අවශ්‍යයි',
  'Is this open today?': 'මෙය අද විවෘතද?',
  'Citizen workspace': 'පුරවැසි වැඩ අවකාශය',
  'Your local services, requests and places—kept in one clear view.': 'ඔබගේ ප්‍රාදේශීය සේවා, ඉල්ලීම් සහ ස්ථාන—එක් පැහැදිලි දැක්මකින්.',
  'Bookings': 'වෙන්කිරීම්',
  'Your requests': 'ඔබගේ ඉල්ලීම්',
  'What the municipality is currently seeing around your area.': 'නගර සභාව විසින් ඔබගේ ප්‍රදේශය තුළ දැනට නිරීක්ෂණය කරන තොරතුරු.',
  'Field operations': 'ක්ෂේත්‍ර මෙහෙයුම්',
  'Today’s field workload.': 'අද දින ක්ෂේත්‍ර වැඩ ප්‍රමාණය.',
  'Prioritized around what needs your attention on the ground.': 'ක්ෂේත්‍රයේ ඔබගේ අවධානය අවශ්‍ය කරුණු අනුව ප්‍රමුඛත්වය දී ඇත.',
  'No overdue endpoint configured': 'කල් ඉකුත් වූ දත්ත සකසා නැත',
  'Assigned route': 'පැවරූ මාර්ගය',
  'Your queue is ordered by server-side priority and the most recently updated municipal work.': 'ඔබගේ වැඩ පෝලිම ප්‍රමුඛතාව සහ මෑතකදී යාවත්කාලීන කළ කටයුතු අනුව පෙළගස්වා ඇත.',
  'No active assignment': 'සක්‍රිය පැවරුම් නැත',
  'No second assignment': 'දෙවන පැවරුමක් නැත',
  'Decisions with context.': 'සන්දර්භය සහිත තීරණ.',
  'Decisions with context': 'සන්දර්භය සහිත තීරණ',
  'Review the case, place, supporting history and operational impact before acting.': 'ක්‍රියාමාර්ග ගැනීමට පෙර නඩුව, ස්ථානය, ඉතිහාසය සහ මෙහෙයුම් බලපෑම සමාලෝචනය කරන්න.',
  'Review approvals': 'අනුමැතීන් සමාලෝචනය කරන්න',
  'Across active workflows': 'සක්‍රිය කාර්ය ප්‍රවාහයන් හරහා',
  'Oldest waiting': 'පැරණිතම රැඳී ඇති',
  'OLDEST WAITING': 'පැරණිතම රැඳී ඇති',
  'Within current SLA': 'වත්මන් SLA කාලය තුළ',
  'Recorded by backend': 'පද්ධතියේ සටහන් වූ',
  'Authorized users': 'බලයලත් පරිශීලකයින්',
  'AUTHORIZED USERS': 'බලයලත් පරිශීලකයින්',
  'Government accounts': 'රාජ්‍ය ගිණුම්',
  'Priority decisions': 'ප්‍රමුඛ තීරණ',
  'PRIORITY DECISIONS': 'ප්‍රමුඛ තීරණ',
  'Awaiting your review': 'ඔබගේ සමාලෝචනය අපේක්ෂාවෙන්',
  'Decision quality': 'තීරණ ගුණාත්මකභාවය',
  'DECISION QUALITY': 'තීරණ ගුණාත්මකභාවය',
  'Approval standards': 'අනුමත කිරීමේ ප්‍රමිතීන්',
  'Every decision should retain its rationale, supporting documents and who approved it.': 'සෑම තීරණයකටම එහි හේතු දැක්වීම, ආධාරක ලේඛන සහ අනුමත කළ පුද්ගලයා ඇතුළත් විය යුතුය.',
  'Context verified': 'සන්දර්භය තහවුරු කරන ලදී',
  'Impact assessed': 'බලපෑම තක්සේරු කරන ලදී',
  'Supporting evidence present': 'සාක්ෂි සහ ලේඛන ඉදිරිපත් කර ඇත',
  'Decision rationale recorded': 'තීරණයේ හේතුව සටහන් කර ඇත',
  'Municipal overview': 'නාගරික සාරාංශය',
  'Good afternoon, Director.': 'සුබ දහවලක්, අධ්‍යක්ෂකතුමනි.',
  'What is happening across the municipality, and where leadership attention can have the most impact.': 'නගර සභාව පුරා සිදුවන දේ සහ නායකත්වයේ අවධානය වැඩි බලපෑමක් කළ හැකි අංශ.',
  'Total requests': 'මුළු ඉල්ලීම්',
  'All recorded service requests': 'සියලු සටහන් වූ සේවා ඉල්ලීම්',
  'Open requests': 'විවෘත ඉල්ලීම්',
  'Currently active cases': 'දැනට සක්‍රිය නඩු',
  'Avg. resolution': 'සාමාන්‍ය විසඳුම් කාලය',
  'Based on resolved requests': 'විසඳූ ඉල්ලීම් මත පදනම්ව',
  'Municipal geography': 'නාගරික භූගෝල විද්‍යාව',
  'Live request map': 'සජීවී ඉල්ලීම් සිතියම',
  'Department performance': 'දෙපාර්තමේන්තු කාර්යක්ෂමතාව',
  'open requests': 'විවෘත ඉල්ලීම්',
  'Municipal demand': 'නාගරික ඉල්ලුම',
  'Requests & resolutions': 'ඉල්ලීම් සහ විසඳුම්',
  'Geographic attention': 'භූගෝලීය අවධානය',
  'Most reported locations': 'වැඩිපුරම වාර්තා වූ ස්ථාන',
  'View map': 'සිතියම බලන්න',
  'report': 'වාර්තාව',
  'reports': 'වාර්තා',
  'No hotspot data yet': 'තවමත් අධික ඉල්ලුම් දත්ත නැත',
  'Reported locations will appear here.': 'වාර්තා වූ ස්ථාන මෙහි දිස්වනු ඇත.',
  'Engineering': 'ඉංජිනේරු',
  'Health': 'සෞඛ්‍ය',
  'Environment': 'පරිසර',
  'Water Supply': 'ජල සම්පාදනය',
  'Waste Management': 'කසළ කළමනාකරණය',
  'Public Works': 'පොදු වැඩ',
  'Administration': 'පරිපාලනය',

  // Workflow stage bar & instructions
  'Request workflow': 'ඉල්ලීම් කාර්ය ප්‍රවාහය',
  'Select a stage to view its requests': 'ඉල්ලීම් බැලීමට අදියරක් තෝරන්න',
  'Recently submitted': 'මෑතකදී ඉදිරිපත් කළ',
  'Being reviewed': 'සමාලෝචනය වෙමින් පවතී',
  'Officer assigned': 'නිලධාරියා පවරා ඇත',
  'Field work': 'ක්ෂේත්‍ර කටයුතු',
  'Waiting for approval': 'අනුමැතිය බලාපොරොත්තුවෙන්',
  'Completed cases': 'සම්පූර්ණ කළ නඩු',

  // Search placeholders
  'Search name, building ID, address or latitude, longitude…': 'නම, ගොඩනැගිලි අංකය, ලිපිනය හෝ ඛණ්ඩාංක සොයන්න…',
  'Search requests...': 'ඉල්ලීම් සොයන්න...',
  'Search by building number, street or parcel...': 'ගොඩනැගිලි අංකය, වීදිය හෝ ඉඩම අනුව සොයන්න...',
  'Search users...': 'පරිශීලකයින් සොයන්න...',

  // Map search bar, controls, and layer names
  'Search a place, building, address or CMC ID...': 'ස්ථානයක්, ගොඩනැගිල්ලක්, ලිපිනයක් හෝ CMC අංකයක් සොයන්න...',
  'Clear search': 'සෙවීම ඉවත් කරන්න',
  'OpenStreetMap place': 'OpenStreetMap ස්ථානය',
  'CMC building': 'CMC ගොඩනැගිල්ල',
  'Place': 'ස්ථානය',
  'Searching places and addresses...': 'ස්ථාන සහ ලිපින සොයමින්...',
  'No matching result found.': 'ගැලපෙන ප්‍රතිඵල හමු නොවීය.',
  'Try a landmark, street, address or CMC building ID.': 'ප්‍රසිද්ධ ස්ථානයක්, වීදියක්, ලිපිනයක් හෝ CMC ගොඩනැගිලි අංකයක් උත්සාහ කරන්න.',
  'Layers': 'ස්ථර',
  'Show all': 'සියල්ල පෙන්වන්න',
  'Report': 'වාර්තා කරන්න',
  'Report here': 'මෙහි වාර්තා කරන්න',
  'Map layers': 'සිතියම් ස්ථර',
  'Search layers...': 'ස්ථර සොයන්න...',
  'Close layer panel': 'ස්ථර පුවරුව වසන්න',
  'Search map layers': 'සිතියම් ස්ථර සොයන්න',
  'Clear layer search': 'ස්ථර සෙවීම ඉවත් කරන්න',
  'Enabled layers stay on top': 'සක්‍රිය ස්ථර ඉහළින් පවතී',
  'shown': 'පෙන්වා ඇත',
  'On': 'සක්‍රියයි',
  'No matching layers': 'ගැලපෙන ස්ථර නැත',
  'Try another layer name.': 'වෙනත් ස්ථර නමක් උත්සාහ කරන්න.',
  'Map view': 'සිතියම් දැක්ම',
  'Standard': 'සාමාන්‍ය',
  'Detailed 2D': 'සවිස්තරාත්මක 2D',
  'RGB': 'RGB',
  'CMC RGB imagery': 'CMC RGB ඡායාරූප',
  'Government requests': 'රාජ්‍ය ඉල්ලීම්',
  'Land parcels': 'ඉඩම් කොටස්',
  'Land parcel': 'ඉඩම් කොටස',
  'Road surface': 'මාර්ග මතුපිට',
  'Road features': 'මාර්ග අංග',
  'Road feature': 'මාර්ග අංගය',
  'Road side lines': 'මාර්ග පැති රේඛා',
  'Road side line': 'මාර්ග පැති රේඛාව',
  'Forbidden lines': 'තහනම් රේඛා',
  'Forbidden line': 'තහනම් රේඛාව',
  'Fences': 'වැටවල්',
  'Fence': 'වැට',
  'Planar facilities': 'තල පහසුකම්',
  'Planar facility': 'තල පහසුකම',
  'Traffic signs': 'මාර්ග සංඥා පුවරු',
  'Traffic sign': 'මාර්ග සංඥා පුවරුව',
  'Signal light posts': 'සංඥා ලාම්පු කණු',
  'Signal light post': 'සංඥා ලාම්පු කණුව',
  'Road boundaries': 'මාර්ග සීමා',
  'Road boundary': 'මාර්ග සීමාව',
  'Road markings': 'මාර්ග සලකුණු',
  'Road marking': 'මාර්ග සලකුණ',
  'Lane lines': 'මංතීරු රේඛා',
  'Lane line': 'මංතීරු රේඛාව',
  'Stop lines': 'නැවතුම් රේඛා',
  'Stop line': 'නැවතුම් රේඛාව',
  'Crosswalks': 'පදික මාරු',
  'Crosswalk': 'පදික මාරුව',
  'Trees': 'ගස්',
  'Tree': 'ගස',
  'Extracted trees': 'හඳුනාගත් ගස්',
  'Extracted tree': 'හඳුනාගත් ගස',
  'Bus stops': 'බස් නැවතුම්',
  'Bus stop': 'බස් නැවතුම',
  'Bus stop areas': 'බස් නැවතුම් ප්‍රදේශ',
  'Bus stop area': 'බස් නැවතුම් ප්‍රදේශය',
  'Sign boards': 'නාම පුවරු',
  'Sign board': 'නාම පුවරුව',
  'Road name boards': 'මාර්ග නාම පුවරු',
  'Road name board': 'මාර්ග නාම පුවරුව',
  'Billboards / digital screens': 'දැන්වීම් පුවරු / ඩිජිටල් තිර',
  'Billboard / digital screen': 'දැන්වීම් පුවරුව / ඩිජිටල් තිරය',
  'Bridges': 'පාලම්',
  'Bridge': 'පාලම',
  'Benches': 'බංකු',
  'Bench': 'බංකුව',
  'Statues / structures': 'ප්‍රතිමා / ව්‍යුහයන්',
  'Statue / structure': 'ප්‍රතිමාව / ව්‍යුහය',
  'Poles': 'කණු',
  'Pole': 'කණුව',
  'Light poles': 'විදුලි පහන් කණු',
  'Light pole': 'විදුලි පහන් කණුව',
  'Telephone / electric posts': 'දුරකථන / විදුලි කණු',
  'Telephone / electric post': 'දුරකථන / විදුලි කණුව',
  'Fence survey points': 'වැට මැනුම් ලක්ෂ්‍ය',
  'Fence survey point': 'වැට මැනුම් ලක්ෂ්‍යය',
  'Manholes': 'මෑන්හෝල්',
  'Manhole': 'මෑන්හෝල්',
  'Stormwater drains': 'වැසි ජල කාණු',
  'Stormwater drain': 'වැසි ජල කාණුව',
  'Fire hydrants': 'ගිනි නිවන ජල කරාම',
  'Fire hydrant': 'ගිනි නිවන ජල කරාමය',
  'Utility boxes': 'උපයෝගිතා පෙට්ටි',
  'Utility box': 'උපයෝගිතා පෙට්ටිය',
  'Sewage assets': 'අපද්‍රව්‍ය වත්කම්',
  'Sewage asset': 'අපද්‍රව්‍ය වත්කම',
  'Pits': 'වලවල්',
  'Pit': 'වල',
  'Water meters': 'ජල මාන',
  'Water meter': 'ජල මානය',
  'Water outlets': 'ජල පිටවීම්',
  'Water outlet': 'ජල පිටවීම',
  'Water valves': 'ජල වෑල්ව',
  'Water valve': 'ජල වෑල්වය',
  'Police / security huts': 'පොලිස් / ආරක්ෂක කුටි',
  'Police / security hut': 'පොලිස් / ආරක්ෂක කුටිය',
  'CMC GIS feature': 'CMC GIS අංගය',
  'Matching this building…': 'මෙම ගොඩනැගිල්ල ගලපමින්…',
  'Checking named OSM features inside the polygon.': 'බහුඅස්‍රය තුළ නම් කරන ලද OSM අංග පරීක්ෂා කරමින්.',
  'Mapped building': 'සිතියම්ගත ගොඩනැගිල්ල',
  'Polygon verified': 'බහුඅස්‍රය තහවුරු කරන ලදී',
  'Name not verified': 'නම තහවුරු කර නැත',
  'Not verified': 'තහවුරු කර නැත',
  'CMC Building ID': 'CMC ගොඩනැගිලි අංකය',
  'Name match': 'නම ගැලපීම',
  'Latitude': 'අක්ෂාංශ',
  'Longitude': 'දේශාංශ',
  'CMC feature properties': 'CMC අංග ගුණාංග',
  'No additional attributes are stored in the CMC building GeoJSON.': 'CMC ගොඩනැගිලි GeoJSON හි අමතර ගුණාංග ගබඩා කර නැත.',
  'Create request here': 'මෙහි ඉල්ලීමක් සාදන්න',
  'Selected building': 'තෝරාගත් ගොඩනැගිල්ල',

  // Security banner & Building items
  'Municipal assets': 'නාගරික වත්කම්',
  'Buildings & properties': 'ගොඩනැගිලි සහ දේපළ',
  'Mapped public and authorized administrative information connected to municipal service history.': 'නගර සභා සේවා ඉතිහාසයට සම්බන්ධ සිතියම්ගත පොදු සහ බලයලත් පරිපාලන තොරතුරු.',
  'Clear building search': 'ගොඩනැගිලි සෙවීම මකන්න',
  'Start typing to search by building name, ID, address or coordinates': 'ගොඩනැගිලි නම, අංකය, ලිපිනය හෝ ඛණ්ඩාංක මඟින් සෙවීමට ටයිප් කිරීම අරඹන්න',
  'Searching for': 'සොයමින් පවතී',
  'Buildings within 250 m of': 'මීටර් 250ක් ඇතුළත ගොඩනැගිලි',
  'Results for': 'ප්‍රතිඵල',
  'Loading tax data': 'බදු දත්ත පූරණය වෙමින්',
  'building': 'ගොඩනැගිල්ල',
  'buildings': 'ගොඩනැගිලි',
  'Search municipal buildings': 'නගර සභා ගොඩනැගිලි සොයන්න',
  'Enter a building name, LGS building ID, CMC ID, address or latitude and longitude.': 'ගොඩනැගිලි නමක්, LGS ගොඩනැගිලි අංකයක්, CMC අංකයක්, ලිපිනයක් හෝ අක්ෂාංශ සහ දේශාංශ ඇතුළත් කරන්න.',
  'Searching buildings...': 'ගොඩනැගිලි සොයමින්...',
  'No buildings found': 'ගොඩනැගිලි හමු නොවීය',
  'Try a building name, CMC/LGS building ID, address or coordinates such as 6.910250, 79.861400.': 'ගොඩනැගිලි නමක්, CMC/LGS ගොඩනැගිලි අංකයක්, ලිපිනයක් හෝ 6.910250, 79.861400 වැනි ඛණ්ඩාංක උත්සාහ කරන්න.',
  'Property': 'දේපළ',
  'Tax ID': 'බදු අංකය',
  'Assessment': 'තක්සේරුව',
  'Open spatial context': 'අවකාශීය සන්දර්භය විවෘත කරන්න',
  'Unable to search building information.': 'ගොඩනැගිලි තොරතුරු සෙවීමට නොහැකි විය.',
  'Unavailable': 'ලබා ගත නොහැක',
  'Authorized data view': 'අවසර ලත් දත්ත දැක්ම',
  'This screen includes property and tax metadata and should only be populated by secure backend responses for permitted roles.': 'මෙම තිරය දේපළ සහ බදු දත්ත ඇතුළත් වන අතර අවසර ලත් භූමිකාවන් සඳහා පමණක් ආරක්ෂිතව පෙන්වනු ලැබේ.',
  'Building details': 'ගොඩනැගිලි විස්තර',
  'Floor area': 'මහල් වර්ගඵලය',
  'Floors': 'මහල්',
  'Occupancy': 'භාවිතය',
  'Property address': 'දේපළ ලිපිනය',
  'Tax assessment': 'බදු තක්සේරුව',
  'Building assessment': 'ගොඩනැගිලි තක්සේරුව',

  // Roles in UI
  'Citizen': 'පුරවැසියා',
  'Field Officer': 'ක්ෂේත්‍ර නිලධාරී',
  'Government Admin': 'රාජ්‍ය පරිපාලක',
  'Approver': 'අනුමත කරන්නා',
  'Municipal Director': 'නගර සභා අධ්‍යක්ෂ',

  // Request detail actions & tabs
  'Request details': 'ඉල්ලීමේ විස්තර',
  'Back to requests': 'ආපසු ඉල්ලීම් වෙත',
  'Assign officer': 'නිලධාරියා පවරන්න',
  'Schedule inspection': 'පරීක්ෂණය සැලසුම් කරන්න',
  'Request approval': 'අනුමැතිය ඉල්ලන්න',
  'Mark resolved': 'විසඳූ ලෙස සලකුණු කරන්න',
  'Reject request': 'ඉල්ලීම ප්‍රතික්ෂේප කරන්න',
  'Close request': 'ඉල්ලීම වසන්න',
  'Notes & comments': 'සටහන් සහ අදහස්',
  'Add note': 'සටහනක් එක් කරන්න',
  'Upload photo': 'ඡායාරූපයක් උඩුගත කරන්න',
  'Download attachment': 'ඇමුණුම බාගන්න',
  'Inspections': 'පරීක්ෂණ',
  'Check in at site': 'ස්ථානයට වාර්තා කරන්න',
  'Site inspection': 'ස්ථානීය පරීක්ෂණය',
  'Inspection notes': 'පරීක්ෂණ සටහන්',
  'Record decision': 'තීරණය සටහන් කරන්න',
  'Activity log': 'ක්‍රියාකාරකම් සටහන',
  'Unable to open this attachment.': 'මෙම ඇමුණුම විවෘත කළ නොහැක.',

  // Public Landing / About / Services / Contact
  'Contact Municipal Council': 'නගර සභාව හා සම්බන්ධ වන්න',
  'Send inquiry': 'විමසීමක් යොමු කරන්න',
  'Send a message': 'පණිවිඩයක් එවන්න',
  'Working hours': 'වැඩ කරන වේලාවන්',
  'Your name': 'ඔබගේ නම',
  'Your email': 'ඔබගේ විද්‍යුත් තැපෑල',
  'Sending message...': 'පණිවිඩය යවමින්...',
  'Message sent successfully': 'පණිවිඩය සාර්ථකව යවන ලදී',
  'An idea born from a real, recurring problem.': 'සැබෑ, පුනරාවර්තී ගැටලුවකින් උපන් අදහසක්.',
  'Common Digital Platform': 'පොදු ඩිජිටල් වේදිකාව',
  'Customizable Workflows': 'සකස් කළ හැකි කාර්ය ප්‍රවාහයන්',
  'Public Portal & Mobile Access': 'මහජන ද්වාරය සහ ජංගම පිවිසුම',
  'Geo-Spatial Dashboard': 'භූ-අවකාශීය පාලක පුවරුව',
  'Field Data Collection': 'ක්ෂේත්‍ර දත්ත එක්රැස් කිරීම',
  'Report & Analytics': 'වාර්තා සහ විශ්ලේෂණ',
  'Tax Collection & Revenue': 'බදු එකතු කිරීම සහ ආදායම්',
  'Land & Spatial Intelligence': 'ඉඩම් සහ අවකාශීය බුද්ධිය',
  'Permits, Certificates & Licensing': 'බලපත්‍ර, සහතික සහ ලියාපදිංචි කිරීම්',
  'Tax, Revenue & Payments': 'බදු, ආදායම් සහ ගෙවීම්',
  'Citizen Engagement & Command Center': 'පුරවැසි සහභාගීත්වය සහ විධාන මධ්‍යස්ථානය',
  'Land Information System (LIS)': 'ඉඩම් තොරතුරු පද්ධතිය (LIS)',
  'City Planning': 'නාගරික සැලසුම්කරණය',
  'Underground Utility Management': 'භූගත උපයෝගිතා කළමනාකරණය',
  'Welcome back.': 'නැවත සාදරයෙන් පිළිගනිමු.',
  'Welcome to LGS': 'LGS වෙත සාදරයෙන් පිළිගනිමු',
  'Create account': 'ගිණුමක් සාදන්න',
  'Create your citizen account to report issues and track service requests.': 'ගැටලු වාර්තා කිරීමට සහ සේවා ඉල්ලීම් නිරීක්ෂණය කිරීමට ඔබගේ පුරවැසි ගිණුම සාදන්න.',
  'Use at least 12 characters.': 'අවම වශයෙන් අක්ෂර 12ක් භාවිතා කරන්න.',

  // Landing Page
  'WHERE WE’RE HEADED': 'අප ගමන් කරන දිශාව',
  'Where we’re headed': 'අප ගමන් කරන දිශාව',
  'One Direction': 'එක් දිශාවක්',
  'Two Ways to Say It': 'එය ප්‍රකාශ කිරීමට ක්‍රම දෙකක්',
  'One Connected Council': 'එක් සම්බන්ධිත සභාවක්',
  'A spatially accurate digital foundation where requests, records and revenue do not get lost between departments.': 'දෙපාර්තමේන්තු අතර ඉල්ලීම්, වාර්තා සහ ආදායම් අතරමං නොවන අවකාශීයව නිවැරදි ඩිජිටල් පදනමක්.',
  'One Map. Every Department.': 'එක් සිතියමක්. සෑම දෙපාර්තමේන්තුවක්ම.',
  'Land records, permits, tax and revenue, certificates and citizen services work from the same verified geographic picture.': 'ඉඩම් වාර්තා, අවසරපත්, බදු සහ ආදායම්, සහතික සහ පුරවැසි සේවා එකම තහවුරු කළ භූගෝලීය දැක්මකින් ක්‍රියාත්මක වේ.',
  'One connected platform': 'එක් සම්බන්ධිත වේදිකාවක්',
  'One Platform. Every Council Function.': 'එක් වේදිකාවක්. සෑම සභා කාර්යයක්ම.',
  'Spatio LGS connects land and spatial intelligence, permits and licensing, tax and revenue, and citizen engagement through one verified geographic foundation.': 'Spatio LGS ඉඩම් සහ අවකාශීය තොරතුරු, අවසරපත් සහ බලපත්‍ර, බදු සහ ආදායම්, සහ පුරවැසි සහභාගීත්වය එක් තහවුරු කළ භූගෝලීය පදනමක් හරහා සම්බන්ධ කරයි.',
  'Connect property and parcel records, boundaries, zoning and spatial intelligence to one verified map.': 'දේපළ සහ ඉඩම් ලේඛන, මායිම්, කලාපකරණය සහ අවකාශීය තොරතුරු එක් තහවුරු කළ සිතියමකට සම්බන්ධ කරන්න.',
  'Track applications, approvals, certificates and licensing workflows from submission to final decision.': 'ඉදිරිපත් කිරීමේ සිට අවසාන තීරණය දක්වා අයදුම්පත්, අනුමැතීන්, සහතික සහ බලපත්‍ර ක්‍රියාවලීන් නිරීක්ෂණය කරන්න.',
  'Manage assessments, bills, collections and arrears with every record tied to a real, mapped property.': 'සැබෑ සිතියම්ගත දේපළකට සම්බන්ධ කරමින් තක්සේරු, බිල්පත්, එකතු කිරීම් සහ හිඟ මුදල් කළමනාකරණය කරන්න.',
  'Bring citizen services, complaints, public participation and executive visibility into one connected system.': 'පුරවැසි සේවා, පැමිණිලි, මහජන සහභාගීත්වය සහ විධායක අධීක්ෂණය එක් සම්බන්ධිත පද්ධතියකට ගෙන එන්න.',
  'View service': 'සේවාව බලන්න',
  'Land': 'ඉඩම්',
  'Permits': 'අවසරපත්',
  'Revenue': 'ආදායම්',
  'Engage': 'සම්බන්ධ වීම',
  'Strong geospatial foundation': 'ශක්තිමත් භූ-අවකාශීය පදනමක්',
  'Every Layer of the City, Finally in One Place.': 'නගරයේ සෑම ස්ථරයක්ම, අවසානයේ එක් තැනක.',
  'Spatial foundation': 'අවකාශීය පදනම',
  'Manage municipal assets and infrastructure with real location intelligence instead of guesswork.': 'අනුමාන කිරීම් වෙනුවට සැබෑ ස්ථානීය බුද්ධිය සමඟ නාගරික වත්කම් සහ යටිතල පහසුකම් කළමනාකරණය කරන්න.',
  'Planning intelligence': 'සැලසුම් බුද්ධිය',
  'Bring land records, ownership and boundaries together clearly so planning starts from facts, not files.': 'ගොනු මත නොව කරුණු මත සැලසුම් ආරම්භ වන පරිදි ඉඩම් වාර්තා, හිමිකාරිත්වය සහ මායිම් පැහැදිලිව එකට ගෙන එන්න.',
  'Infrastructure intelligence': 'යටිතල පහසුකම් බුද්ධිය',
  'Map and manage water, sewerage, electricity and telecom networks before anyone breaks ground.': 'කිසිවකු බිම කැණීමට පෙර ජලය, අපද්‍රව්‍ය, විදුලිය සහ විදුලි සංදේශ ජාල සිතියම්ගත කර කළමනාකරණය කරන්න.',
  'Why Spatio LGS?': 'Spatio LGS තෝරාගත යුත්තේ ඇයි?',
  'One Filing Cabinet Away From Chaos': 'අවුල් සහගත තත්ත්වයෙන් මිදීමට එක් පියවරක්',
  'From Filing to Finishing': 'ගොනු කිරීමේ සිට අවසන් කිරීම දක්වා',
  'Real-time spatial data and automated workflows can turn long approval chains into faster, more accountable decisions.': 'තථ්‍ය කාලීන අවකාශීය දත්ත සහ ස්වයංක්‍රීය කාර්ය ප්‍රවාහයන් මඟින් දිගු අනුමත කිරීම් වේගවත් හා වඩාත් වගකිවයුතු තීරණ බවට පත් කළ හැකිය.',
  'Nothing Hidden, Nothing Lost': 'කිසිවක් සැඟවී නැත, කිසිවක් අහිමි නොවේ',
  'Every department sees the same data, while citizens can follow their own request instead of wondering where it went.': 'සෑම දෙපාර්තමේන්තුවකටම එකම දත්ත පෙනෙන අතර, පුරවැසියන්ට තම ඉල්ලීම කොහේ ගියේදැයි සිතමින් නොසිට එය නිරීක්ෂණය කළ හැකිය.',
  'Decisions Grounded in Reality': 'යථාර්ථය මත පදනම් වූ තීරණ',
  'Dashboards built on live field data help councils plan from what is actually there, not from assumptions.': 'සජීවී ක්ෂේත්‍ර දත්ත මත පදනම් වූ උපකරණ පුවරු සභාවන්ට උපකල්පන මත නොව සැබවින්ම පවතින දේ මත පදනම්ව සැලසුම් කිරීමට උපකාරී වේ.',
  'How it works': 'එය ක්‍රියා කරන ආකාරය',
  'From a Location to a Decision': 'ස්ථානයක සිට තීරණයක් දක්වා',
  '- in Four Steps.': '- පියවර හතරකින්.',
  'Four steps. One system. A council that finally moves as fast as its city does.': 'පියවර හතරක්. එක් පද්ධතියක්. අවසානයේ නගරය මෙන්ම වේගයෙන් ගමන් කරන සභාවක්.',
  'Map It': 'සිතියම්ගත කරන්න',
  'Every parcel, road, building and utility line becomes part of one accurate digital map of the council area.': 'සෑම ඉඩම් කොටසක්, මාර්ගයක්, ගොඩනැගිල්ලක් සහ උපයෝගිතා මාර්ගයක්ම සභා බලප්‍රදේශයේ එක් නිවැරදි ඩිජිටල් සිතියමක කොටසක් බවට පත්වේ.',
  'Connect It': 'සම්බන්ධ කරන්න',
  'Land records, permits, tax data and citizen services all link back to the same map.': 'ඉඩම් වාර්තා, අවසරපත්, බදු දත්ත සහ පුරවැසි සේවා සියල්ල එකම සිතියමකට සම්බන්ධ වේ.',
  'Act On It': 'ක්‍රියාත්මක වන්න',
  'Citizens access properties, applications, permits, tax dues, complaints, certificates and notifications from one dashboard.': 'පුරවැසියන් එක් උපකරණ පුවරුවකින් දේපළ, අයදුම්පත්, අවසරපත්, බදු හිඟ මුදල්, පැමිණිලි, සහතික සහ දැනුම්දීම් වෙත ප්‍රවේශ වේ.',
  'Track It': 'නිරීක්ෂණය කරන්න',
  'Commissioners and division heads can watch revenue, complaints and projects unfold in real time from one dashboard.': 'කොමසාරිස්වරුන්ට සහ අංශ ප්‍රධානීන්ට එක් උපකරණ පුවරුවකින් තථ්‍ය කාලීනව ආදායම, පැමිණිලි සහ ව්‍යාපෘති අධීක්ෂණය කළ හැකිය.',
  'Geospatial foundation': 'භූ-අවකාශීය පදනම',
  'Every Layer of the City,': 'නගරයේ සෑම ස්ථරයක්ම,',
  'Finally in One Place.': 'අවසානයේ එක් තැනක.',
  'From what’s underground to what’s being planned next — captured, mapped and ready to use.': 'භූගතව ඇති දේ සිට ඊළඟට සැලසුම් කරන දේ දක්වා — ග්‍රහණය කර, සිතියම්ගත කර භාවිතයට සූදානම්.',
  'Open the municipal map': 'නගර සභා සිතියම විවෘත කරන්න',
  'Connected spatial intelligence': 'සම්බන්ධිත අවකාශීය බුද්ධිය',
  'One Map. Every Department. Every Answer.': 'එක් සිතියමක්. සෑම දෙපාර්තමේන්තුවක්ම. සෑම පිළිතුරක්ම.',
  'Ready to transform your council?': 'ඔබේ සභාව පරිවර්තනය කිරීමට සූදානම්ද?',
  'Request a demo and meet our team.': 'ආදර්ශන සැසියක් ඉල්ලා අපගේ කණ්ඩායම හමුවන්න.',
  'See how Spatio LGS can bring land records, permits, revenue, assets and citizen services into one connected geospatial platform.': 'ඉඩම් වාර්තා, අවසරපත්, ආදායම්, වත්කම් සහ පුරවැසි සේවා එක් සම්බන්ධිත භූ-අවකාශීය වේදිකාවකට Spatio LGS මඟින් ගෙන එන ආකාරය බලන්න.',
  'Request a demo': 'ආදර්ශනයක් ඉල්ලන්න',
  'Platform': 'වේදිකාව',
  'Designed for': 'නිර්මාණය කර ඇත්තේ',
  'Municipal & Urban Councils': 'මහා නගර සහ නගර සභා සඳහා',
  'Purpose': 'අරමුණ',
  'Geospatial decision support': 'භූ-අවකාශීය තීරණ සහාය',
  'A location-aware civic platform connecting residents, services, field teams and local government through one shared municipal map.': 'එක් පොදු නගර සභා සිතියමක් හරහා පදිංචිකරුවන්, සේවා, ක්ෂේත්‍ර කණ්ඩායම් සහ පළාත් පාලන ආයතන සම්බන්ධ කරන ස්ථානීය-දැනුවත් පුරවැසි වේදිකාවකි.',
  
  'Location Drives Insight' : 'ස්ථානයෙන් අවබෝධයට',
  'Governance Evolves' : 'අවබෝධයෙන් නව පාලනයකට',

}

for (const [enStr, siStr] of Object.entries(additionalPhrases)) {
  phraseMap[enStr.trim()] = siStr.trim()
}

/**
 * Reverse mapping from Sinhala string -> English string
 * for reliable and instant conversion back to English.
 */
export const reversePhraseMap: Record<string, string> = {}
for (const [enStr, siStr] of Object.entries(phraseMap)) {
  reversePhraseMap[siStr.trim()] = enStr.trim()
}

/**
 * Translates text bidirectionally between English and Sinhala.
 * Preserves place names, personal names, codes, dates, and technical formats untouched.
 */
export function translateText(text: string, lang: Language): string {
  const trimmed = text.trim()
  if (!trimmed) return text

  if (lang === 'en') {
    // If the text is Sinhala, convert it back to English
    if (reversePhraseMap[trimmed]) {
      return text.replace(trimmed, reversePhraseMap[trimmed])
    }

    const lower = trimmed.toLowerCase()
    for (const [key, value] of Object.entries(reversePhraseMap)) {
      if (key.toLowerCase() === lower) {
        return text.replace(trimmed, value)
      }
    }

    // Dynamic patterns in reverse
    const greetingMatchSi = trimmed.match(/^සුබ දහවලක්,\s+(.+)\.$/)
    if (greetingMatchSi) {
      return text.replace(trimmed, `Good afternoon, ${greetingMatchSi[1]}.`)
    }

    const wardPulseMatchSi = trimmed.match(/^(Ward\s+\d+)\s+සක්‍රියතාව$/)
    if (wardPulseMatchSi) {
      return text.replace(trimmed, `${wardPulseMatchSi[1]} pulse`)
    }

    const searchingForMatchSi = trimmed.match(/^"(.+)" සොයමින් පවතී\.\.\.$/)
    if (searchingForMatchSi) {
      return text.replace(trimmed, `Searching for "${searchingForMatchSi[1]}"...`)
    }

    const resultsForMatchSi = trimmed.match(/^"(.+)" සඳහා ප්‍රතිඵල$/)
    if (resultsForMatchSi) {
      return text.replace(trimmed, `Results for "${resultsForMatchSi[1]}"`)
    }

    const buildingsNearMatchSi = trimmed.match(/^(.+)\s+සිට මීටර් 250ක් ඇතුළත ගොඩනැගිලි$/)
    if (buildingsNearMatchSi) {
      return text.replace(trimmed, `Buildings within 250 m of ${buildingsNearMatchSi[1]}`)
    }

    const buildingCountMatchSi = trimmed.match(/^(\d+)\s+(ගොඩනැගිල්ල|ගොඩනැගිලි)$/)
    if (buildingCountMatchSi) {
      const count = buildingCountMatchSi[1]
      return text.replace(trimmed, `${count} ${count === '1' ? 'building' : 'buildings'}`)
    }

    if (trimmed.startsWith('LGS / ')) {
      const sub = trimmed.slice(6).trim()
      if (reversePhraseMap[sub]) {
        return text.replace(trimmed, `LGS / ${reversePhraseMap[sub]}`)
      }
    }

    return text
  }

  // lang === 'si'
  // 1. Strict preservation check for names, places, and IDs
  if (isPreservedEntity(trimmed)) {
    return text
  }

  // 2. Exact match in dictionary
  if (phraseMap[trimmed]) {
    return text.replace(trimmed, phraseMap[trimmed])
  }

  // Case-insensitive lookup fallback
  const lower = trimmed.toLowerCase()
  for (const [key, value] of Object.entries(phraseMap)) {
    if (key.toLowerCase() === lower) {
      return text.replace(trimmed, value)
    }
  }

  // 3. Dynamic patterns that preserve placeholders, user names, or numbers
  const greetingMatch = trimmed.match(/^(Good morning|Good afternoon|Good evening),\s+(.+)\.$/i)
  if (greetingMatch) {
    const namePart = greetingMatch[2]
    return text.replace(trimmed, `සුබ දහවලක්, ${namePart}.`)
  }

  const wardPulseMatch = trimmed.match(/^(Ward\s+\d+)\s+pulse$/i)
  if (wardPulseMatch) {
    return text.replace(trimmed, `${wardPulseMatch[1]} සක්‍රියතාව`)
  }

  const searchingForMatch = trimmed.match(/^Searching for "(.+)"\.\.\.$/i)
  if (searchingForMatch) {
    return text.replace(trimmed, `"${searchingForMatch[1]}" සොයමින් පවතී...`)
  }

  const resultsForMatch = trimmed.match(/^Results for "(.+)"$/i)
  if (resultsForMatch) {
    return text.replace(trimmed, `"${resultsForMatch[1]}" සඳහා ප්‍රතිඵල`)
  }

  const buildingsNearMatch = trimmed.match(/^Buildings within 250 m of\s+(.+)$/i)
  if (buildingsNearMatch) {
    return text.replace(trimmed, `${buildingsNearMatch[1]} සිට මීටර් 250ක් ඇතුළත ගොඩනැගිලි`)
  }

  const buildingCountMatch = trimmed.match(/^(\d+)\s+buildings?$/i)
  if (buildingCountMatch) {
    const count = buildingCountMatch[1]
    const label = count === '1' ? 'ගොඩනැගිල්ල' : 'ගොඩනැගිලි'
    return text.replace(trimmed, `${count} ${label}`)
  }

  if (trimmed.startsWith('LGS / ')) {
    const sub = trimmed.slice(6).trim()
    if (phraseMap[sub]) {
      return text.replace(trimmed, `LGS / ${phraseMap[sub]}`)
    }
  }

  return text
}
