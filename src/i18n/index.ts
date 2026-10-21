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
  'Explore map': 'සිතියම',
  'Sign in': 'පිවිසෙන්න',
  'Sign out': 'පිටවන්න',
  'Overview': 'සාරාංශය',
  'Municipal map': 'සභා බලප්‍රදේශයේ සිතියම',
  'My requests': 'මගේ ඉල්ලීම්',
  'My bookings': 'මගේ වෙන්කිරීම්',
  'My tax payments': 'මගේ බදු ගෙවීම්',
  'Applications': 'අයදුම්පත්',
  'Requests': 'ඉල්ලීම්',
  'Bookings': 'වෙන්කිරීම්',
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
  'Government portal': 'රාජ්‍ය සේවා ද්වාරය',
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
  'Learn more': 'වැඩි විස්තර',
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
  'Notifications': 'දැනුම්දීම්',
  'Updates': 'යාවත්කාලීන',
  'UPDATES': 'යාවත්කාලීන',
  'Unread': 'නොකියවූ',
  'Mark all as read': 'සියල්ල කියවූ ලෙස සලකුණු කරන්න',
  'Mark all read': 'සියල්ල කියවූ ලෙස සලකුණු කරන්න',
  'Close notifications': 'දැනුම්දීම් වසන්න',
  'Loading notifications...': 'දැනුම්දීම් පූරණය වෙමින්...',
  'Unable to load notifications': 'දැනුම්දීම් පූරණය කිරීමට නොහැකි විය',
  'Unable to load notifications.': 'දැනුම්දීම් පූරණය කිරීමට නොහැකි විය.',
  'Notifications could not be loaded.': 'දැනුම්දීම් පූරණය කිරීමට නොහැකි විය.',
  'Try again': 'නැවත උත්සාහ කරන්න',
  'View': 'බලන්න',
  "You're all caught up": 'ඔබ සියලු දැනුම්දීම් පරීක්ෂා කර ඇත',
  "You're all caught up.": 'ඔබ සියලු දැනුම්දීම් පරීක්ෂා කර ඇත.',
  'You’re all caught up.': 'ඔබ සියලු දැනුම්දීම් පරීක්ෂා කර ඇත.',
  'New municipal updates will appear here.': 'නව නගර සභා යාවත්කාලීන කිරීම් මෙහි දිස්වනු ඇත.',
  'Refreshing...': 'යාවත්කාලීන වෙමින්...',
  'Refresh': 'නැවුම් කරන්න',
  'No notifications found': 'දැනුම්දීම් හමු නොවීය',
  'No unread notifications': 'නොකියවූ දැනුම්දීම් නොමැත',
  'No notifications yet': 'තවමත් දැනුම්දීම් නොමැත',
  'You have read all of your current updates.': 'ඔබ ඔබගේ සියලු වත්මන් යාවත්කාලීන කිරීම් කියවා ඇත.',
  'Request, inspection and approval updates will appear here.': 'ඉල්ලීම්, පරීක්ෂණ සහ අනුමත කිරීම් යාවත්කාලීන කිරීම් මෙහි දිස්වනු ඇත.',
  'Open related item': 'අදාළ අයිතමය විවෘත කරන්න',
  'Unread notification': 'නොකියවූ දැනුම්දීම',
  'Updates automatically every 30 seconds': 'සෑම තත්පර 30කට වරක් ස්වයංක්‍රීයව යාවත්කාලීන වේ',

  // Notification Titles & States
  'Request received': 'ඉල්ලීම ලැබුණි',
  'Your complaint has been resolved': 'ඔබගේ පැමිණිල්ල විසඳා ඇත',
  'Inspection started': 'පරීක්ෂාව ආරම්භ කරන ලදී',
  'Inspection completed': 'පරීක්ෂාව සම්පූර්ණ කරන ලදී',
  'Inspection scheduled': 'පරීක්ෂණය සැලසුම් කර ඇත',
  'New request assigned': 'නව ඉල්ලීමක් පවරා ඇත',
  'Your request was assigned': 'ඔබගේ ඉල්ලීම නිලධාරියෙකු වෙත පවරන ලදී',
  'Request reassigned to you': 'ඉල්ලීම නැවත ඔබට පවරන ලදී',
  'Assignment removed': 'පැවරුම ඉවත් කරන ලදී',
  'Officer reassigned': 'වෙනත් නිලධාරියෙකු පවරන ලදී',
  'Action required': 'ක්‍රියාමාර්ග අවශ්‍යයි',
  'Request resolved': 'ඉල්ලීම විසඳා ඇත',
  'Request closed': 'ඉල්ලීම වසා ඇත',
  'Request status updated': 'ඉල්ලීමේ තත්ත්වය යාවත්කාලීන විය',
  'Field work completed': 'ක්ෂේත්‍ර වැඩ සම්පූර්ණ කරන ලදී',
  'Officer checked in at site': 'නිලධාරියා අදාළ ස්ථානයට පැමිණ වාර්තා කරන ලදී',
  'Approval required': 'අනුමැතිය අවශ්‍යයි',
  'Request sent for approval': 'ඉල්ලීම අනුමැතිය සඳහා යොමු කරන ලදී',
  'Tax Payment Confirmed': 'බදු ගෙවීම තහවුරු කරන ලදී',
  'Tax payment confirmed': 'බදු ගෙවීම තහවුරු කරන ලදී',
  'Booking Confirmed': 'වෙන්කිරීම තහවුරු කරන ලදී',
  'Booking confirmed': 'වෙන්කිරීම තහවුරු කරන ලදී',
  'Booking cancelled': 'වෙන්කිරීම අවලංගු කරන ලදී',
  'Booking completed': 'වෙන්කිරීම සම්පූර්ණයි',
  'Booking pending': 'වෙන්කිරීම බලාපොරොත්තු වේ',
  'Booking rejected': 'වෙන්කිරීම ප්‍රතික්ෂේපයි',
  'Yesterday': 'ඊයේ',
  'Just now': 'දැන්',
  'About Spatio LGS': 'Spatio LGS පිළිබඳව',
  'Our approach': 'අපගේ ප්‍රවේශය',
  'One connected picture for every council.': 'සෑම නගර සභාවකටම එක් සම්බන්ධිත දර්ශනයක්.',
  'Local government information is often spread across paper records, separate departments and disconnected systems. Spatio LGS connects land records, infrastructure, planning information and public services through one spatially aware platform, helping councils move toward connected, data-driven and sustainable governance.':
    'පළාත් පාලන ආයතනවල තොරතුරු බොහෝ විට ලිපිගොනු, විවිධ අංශ සහ එකිනෙකට සම්බන්ධ නොවූ පද්ධති අතර විසිරී පවතී. Spatio LGS මඟින් ඉඩම් තොරතුරු, යටිතල පහසුකම්, නගර සැලසුම් සහ මහජන සේවාවන් භූගෝලීය පිහිටීම පදනම් කරගත් එක් ඩිජිටල් පද්ධතියකට සම්බන්ධ කරයි. එමඟින් පළාත් පාලන ආයතනවලට වඩාත් කාර්යක්ෂමව, නිවැරදි තොරතුරු මත පදනම්ව සහ දිගුකාලීන දැක්මක් ඇතිව කටයුතු කිරීමට අවස්ථාව සැලසේ.',
  "Local government information is often spread\r\n                  across paper records, separate departments and\r\n                  disconnected systems. Spatio LGS connects land\r\n                  records, infrastructure, planning information\r\n                  and public services through one spatially aware\r\n                  platform, helping councils move toward\r\n                  connected, data-driven and sustainable\r\n                  governance.":
    'පළාත් පාලන ආයතනවල තොරතුරු බොහෝ විට ලිපිගොනු, විවිධ අංශ සහ එකිනෙකට සම්බන්ධ නොවූ පද්ධති අතර විසිරී පවතී. Spatio LGS මඟින් ඉඩම් තොරතුරු, යටිතල පහසුකම්, නගර සැලසුම් සහ මහජන සේවාවන් භූගෝලීය පිහිටීම පදනම් කරගත් එක් ඩිජිටල් පද්ධතියකට සම්බන්ධ කරයි. එමඟින් පළාත් පාලන ආයතනවලට වඩාත් කාර්යක්ෂමව, නිවැරදි තොරතුරු මත පදනම්ව සහ දිගුකාලීන දැක්මක් ඇතිව කටයුතු කිරීමට අවස්ථාව සැලසේ.',
  "Local government information is often spread\n                  across paper records, separate departments and\n                  disconnected systems. Spatio LGS connects land\n                  records, infrastructure, planning information\n                  and public services through one spatially aware\n                  platform, helping councils move toward\n                  connected, data-driven and sustainable\n                  governance.":
    'පළාත් පාලන ආයතනවල තොරතුරු බොහෝ විට ලිපිගොනු, විවිධ අංශ සහ එකිනෙකට සම්බන්ධ නොවූ පද්ධති අතර විසිරී පවතී. Spatio LGS මඟින් ඉඩම් තොරතුරු, යටිතල පහසුකම්, නගර සැලසුම් සහ මහජන සේවාවන් භූගෝලීය පිහිටීම පදනම් කරගත් එක් ඩිජිටල් පද්ධතියකට සම්බන්ධ කරයි. එමඟින් පළාත් පාලන ආයතනවලට වඩාත් කාර්යක්ෂමව, නිවැරදි තොරතුරු මත පදනම්ව සහ දිගුකාලීන දැක්මක් ඇතිව කටයුතු කිරීමට අවස්ථාව සැලසේ.',
  'Data-driven decisions using reliable, real-time and spatially aware information':
    'විශ්වාසදායක, යාවත්කාලීන සහ භූගෝලීය තොරතුරු ඇසුරින් වඩාත් නිවැරදි තීරණ ගැනීම.',
  "Data-driven decisions using reliable,\r\n                    real-time and spatially aware information":
    'විශ්වාසදායක, යාවත්කාලීන සහ භූගෝලීය තොරතුරු ඇසුරින් වඩාත් නිවැරදි තීරණ ගැනීම.',
  "Data-driven decisions using reliable,\n                    real-time and spatially aware information":
    'විශ්වාසදායක, යාවත්කාලීන සහ භූගෝලීය තොරතුරු ඇසුරින් වඩාත් නිවැරදි තීරණ ගැනීම.',
  'Interoperability across departments, agencies and connected government systems':
    'පළාත් පාලන ආයතනයේ විවිධ අංශ, රාජ්ය ආයතන සහ තොරතුරු පද්ධති අතර පහසු සම්බන්ධීකරණයක් ඇති කිරීම.',
  "Interoperability across departments,\r\n                    agencies and connected government systems":
    'පළාත් පාලන ආයතනයේ විවිධ අංශ, රාජ්ය ආයතන සහ තොරතුරු පද්ධති අතර පහසු සම්බන්ධීකරණයක් ඇති කිරීම.',
  "Interoperability across departments,\n                    agencies and connected government systems":
    'පළාත් පාලන ආයතනයේ විවිධ අංශ, රාජ්ය ආයතන සහ තොරතුරු පද්ධති අතර පහසු සම්බන්ධීකරණයක් ඇති කිරීම.',
  'Citizen-centric services focused on accessibility, responsiveness and transparency':
    'ජනතාවට පහසුවෙන් ලබාගත හැකි, කඩිනම් සහ විනිවිදභාවයෙන් යුතු සේවාවන් සැපයීම.',
  "Citizen-centric services focused on\r\n                    accessibility, responsiveness and\r\n                    transparency":
    'ජනතාවට පහසුවෙන් ලබාගත හැකි, කඩිනම් සහ විනිවිදභාවයෙන් යුතු සේවාවන් සැපයීම.',
  "Citizen-centric services focused on\n                    accessibility, responsiveness and\n                    transparency":
    'ජනතාවට පහසුවෙන් ලබාගත හැකි, කඩිනම් සහ විනිවිදභාවයෙන් යුතු සේවාවන් සැපයීම.',
  'Secure, privacy-aware and trusted handling of municipal information':
    'පළාත් පාලන ආයතනවල තොරතුරු ආරක්ෂිතව සහ පෞද්ගලිකත්වය සුරකිමින් කළමනාකරණය කිරීම.',
  "Secure, privacy-aware and trusted handling\r\n                    of municipal information":
    'පළාත් පාලන ආයතනවල තොරතුරු ආරක්ෂිතව සහ පෞද්ගලිකත්වය සුරකිමින් කළමනාකරණය කිරීම.',
  "Secure, privacy-aware and trusted handling\n                    of municipal information":
    'පළාත් පාලන ආයතනවල තොරතුරු ආරක්ෂිතව සහ පෞද්ගලිකත්වය සුරකිමින් කළමනාකරණය කිරීම.',
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
  'Explore requests on map': 'ඉල්ලීම් ඇති ස්ථාන සිතියමෙන් බලන්න',
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
  'Your local services, requests and places—kept in one clear view.': 'ඔබගේ ප්‍රාදේශීය සේවා, ඉල්ලීම් සහ ස්ථාන එක් පැහැදිලි දැක්මකින්.',
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
  'Message sent successfully': 'පණිවිඩය සාර්ථකව යවන ලදී',
  'Unable to send the request.': 'ඉල්ලීම යැවීමට නොහැකි විය.',
  'Failed to send your message. Please try again.': 'ඔබගේ පණිවිඩය යැවීමට නොහැකි විය. කරුණාකර නැවත උත්සාහ කරන්න.',
  'Thank you for reaching out. We have received your inquiry and our team will get back to you shortly.': 'අප හා සම්බන්ධ වීම පිළිබඳව ස්තූතියි. ඔබගේ විමසීම ලැබුණු අතර, අපගේ කණ්ඩායම ඉක්මනින් ඔබ හා සම්බන්ධ වනු ඇත.',
  'OK': 'හරි',
  'An idea born from a real, recurring problem.': 'සැබෑ, පුනරාවර්තී ගැටලුවකින් උපන් අදහසක්.',
  'An Idea Born From a Real,': 'සැබෑ, පුනරාවර්තී ගැටලුවකින්',
  'Recurring Problem.': 'උපන් අදහසක්.',
  'An Idea Born From a Real, Recurring Problem.': 'සැබෑ, පුනරාවර්තී ගැටලුවකින් උපන් අදහසක්.',
  'Spatio LGS is a geospatial decision-support platform for Municipal and Urban Councils, bringing land management, permits, revenue, civic services and citizen engagement into one connected digital system.':
    'නගර සභා සහ මහ නගර සභා සඳහා ඉඩම් කළමනාකරණය, අවසරපත්‍ර, ආදායම්, සිවිල් සේවා සහ පුරවැසි සබඳතා එකම ඒකාබද්ධ ඩිජිටල් පද්ධතියකට ගෙන එන භූ-අවකාශීය තීරණ සහායක වේදිකාවකි Spatio LGS.',
  'One platform. Ten jobs.': 'එකම පද්ධතියක්. සේවා රැසක්.',
  'Zero filing cabinets.': 'ලිපිගොනු ගොඩවල් වෙනුවට ඩිජිටල් විසඳුමක්.',
  'One Platform. Ten Jobs.': 'එකම පද්ධතියක්. සේවා රැසක්.',
  'Zero Filing Cabinets.': 'ලිපිගොනු ගොඩවල් වෙනුවට ඩිජිටල් විසඳුමක්.',
  'One platform. Ten jobs. Zero filing cabinets.': 'එකම පද්ධතියක්. සේවා රැසක්. ලිපිගොනු ගොඩවල් වෙනුවට ඩිජිටල් විසඳුමක්.',
  'One Platform. Ten Jobs. Zero Filing Cabinets.': 'එකම පද්ධතියක්. සේවා රැසක්. ලිපිගොනු ගොඩවල් වෙනුවට ඩිජිටල් විසඳුමක්.',
  'Every job a council runs today, reimagined as one connected digital system.':
    'පළාත් පාලන ආයතනයක දෛනික කටයුතු සියල්ල වඩාත් පහසු, කාර්යක්ෂම සහ සම්බන්ධීකරණය වූ එක් ඩිජිටල් පද්ධතියක් හරහා කළමනාකරණය කිරීමට සැලසුම් කර ඇත.',
  'Every function a municipal council runs today, rebuilt as one connected digital system.':
    'පළාත් පාලන ආයතනයක දෛනික කටයුතු සියල්ල වඩාත් පහසු, කාර්යක්ෂම සහ සම්බන්ධීකරණය වූ එක් ඩිජිටල් පද්ධතියක් හරහා කළමනාකරණය කිරීමට සැලසුම් කර ඇත.',
  "Every function a municipal council runs today,\r\n                rebuilt as one connected digital system.":
    'පළාත් පාලන ආයතනයක දෛනික කටයුතු සියල්ල වඩාත් පහසු, කාර්යක්ෂම සහ සම්බන්ධීකරණය වූ එක් ඩිජිටල් පද්ධතියක් හරහා කළමනාකරණය කිරීමට සැලසුම් කර ඇත.',
  "Every function a municipal council runs today,\n                rebuilt as one connected digital system.":
    'පළාත් පාලන ආයතනයක දෛනික කටයුතු සියල්ල වඩාත් පහසු, කාර්යක්ෂම සහ සම්බන්ධීකරණය වූ එක් ඩිජිටල් පද්ධතියක් හරහා කළමනාකරණය කිරීමට සැලසුම් කර ඇත.',
  'Let’s put your council': 'ඔබගේ සභාව එක්කරමු',
  "Let's put your council": 'ඔබගේ සභාව එක්කරමු',
  'on the map.': 'ඩිජිටල් සිතියමට.',
  'On the Map.': 'ඩිජිටල් සිතියමට.',
  "Talk to the Spatio LGS team about your council’s needs, existing challenges and how a connected geospatial platform can support better local government operations.":
    'ඔබගේ සභාවේ අවශ්‍යතා, පවතින අභියෝග සහ ඒකාබද්ධ භූ-අවකාශීය වේදිකාවක් මඟින් පළාත් පාලන මෙහෙයුම් වඩාත් ඵලදායී ලෙස සිදු කළ හැකි ආකාරය පිළිබඳව Spatio LGS කණ්ඩායම සමඟ සාකච්ඡා කරන්න.',
  "Talk to the Spatio LGS team about your council’s\r\n                needs, existing challenges and how a connected\r\n                geospatial platform can support better local\r\n                government operations.":
    'ඔබගේ සභාවේ අවශ්‍යතා, පවතින අභියෝග සහ ඒකාබද්ධ භූ-අවකාශීය වේදිකාවක් මඟින් පළාත් පාලන මෙහෙයුම් වඩාත් ඵලදායී ලෙස සිදු කළ හැකි ආකාරය පිළිබඳව Spatio LGS කණ්ඩායම සමඟ සාකච්ඡා කරන්න.',
  "Talk to the Spatio LGS team about your council’s\n                needs, existing challenges and how a connected\n                geospatial platform can support better local\n                government operations.":
    'ඔබගේ සභාවේ අවශ්‍යතා, පවතින අභියෝග සහ ඒකාබද්ධ භූ-අවකාශීය වේදිකාවක් මඟින් පළාත් පාලන මෙහෙයුම් වඩාත් ඵලදායී ලෙස සිදු කළ හැකි ආකාරය පිළිබඳව Spatio LGS කණ්ඩායම සමඟ සාකච්ඡා කරන්න.',
  'Platform capability': 'පද්ධතියේ විශේෂාංග',
  'Common Digital Platform': 'ඒකාබද්ධ ඩිජිටල් පද්ධතිය',
  'A single shared system connecting every department — replacing scattered logins, forms and spreadsheets with one login and one source of truth.':
    'විවිධ අංශවල තොරතුරු සහ කාර්යයන් එක් පද්ධතියකට සම්බන්ධ කරමින්, වෙන වෙනම පද්ධති භාවිත කිරීමේ අවශ්යතාව අඩු කරයි. එක් පිවිසුමකින් අවශ්ය සේවාවන් වෙත පහසුවෙන් ප්රවේශ විය හැකිය.',
  'A single shared system connecting every department - replacing scattered logins, forms and spreadsheets with one login and one source of truth.':
    'විවිධ අංශවල තොරතුරු සහ කාර්යයන් එක් පද්ධතියකට සම්බන්ධ කරමින්, වෙන වෙනම පද්ධති භාවිත කිරීමේ අවශ්යතාව අඩු කරයි. එක් පිවිසුමකින් අවශ්ය සේවාවන් වෙත පහසුවෙන් ප්රවේශ විය හැකිය.',
  'Customizable Workflows': 'අවශ්යතාවට ගැළපෙන කාර්ය ක්රියාවලි',
  'Adapts to the council’s existing processes and department structure instead of forcing the council to rebuild its operations from scratch.':
    'පළාත් පාලන ආයතනයේ පවතින ක්රමවේද සහ අංශවල අවශ්යතා අනුව කාර්ය ක්රියාවලි සකස් කරගත හැකි අතර, දැනට සිදුකරන කටයුතු සම්පූර්ණයෙන් වෙනස් කිරීමට අවශ්ය නොවේ.',
  "Adapts to the council's existing processes and department structure instead of forcing the council to rebuild its operations from scratch.":
    'පළාත් පාලන ආයතනයේ පවතින ක්රමවේද සහ අංශවල අවශ්යතා අනුව කාර්ය ක්රියාවලි සකස් කරගත හැකි අතර, දැනට සිදුකරන කටයුතු සම්පූර්ණයෙන් වෙනස් කිරීමට අවශ්ය නොවේ.',
  'Public Portal & Mobile Access': 'මහජන සේවා ද්වාරය සහ ජංගම ප්රවේශය',
  'Access council services from anywhere through a responsive web portal and installable mobile experience without being tied to a council counter.':
    'සභා කාර්යාලයට පැමිණීමකින් තොරව, පරිගණකයක් හෝ ජංගම දුරකථනයක් භාවිතයෙන් ඕනෑම ස්ථානයක සිට මහජන සේවාවන් වෙත පහසුවෙන් ප්රවේශ විය හැකිය.',
  'Geo-Spatial Dashboard': 'භූගෝලීය තොරතුරු දර්ශක පුවරුව',
  'Maps, land data, municipal assets and operational decisions are layered onto one interactive geographic view of the council area.':
    'සභා බලප්රදේශයේ සිතියම්, ඉඩම් තොරතුරු, පොදු දේපළ සහ අනෙකුත් වැදගත් දත්ත එකම අන්තර්ක්රියාකාරී සිතියමක් ඔස්සේ නිරීක්ෂණය කර තීරණ ගැනීමට පහසුකම් සලසයි.',
  'Field Data Collection': 'ක්ෂේත්ර තොරතුරු රැස් කිරීම',
  'Turns mobile devices into real-time GIS-based data capture tools for field officers, making field information available quickly and accurately.':
    'ක්ෂේත්ර නිලධාරීන්ට ජංගම උපාංග භාවිතයෙන් ස්ථානීය තොරතුරු සහ අනෙකුත් දත්ත සෘජුවම පද්ධතියට ඇතුළත් කළ හැකි අතර, එම තොරතුරු ඉක්මනින් සහ නිවැරදිව ලබාගත හැකිය.',
  'Report & Analytics': 'වාර්තා සහ දත්ත විශ්ලේෂණය',
  'Converts raw operational information into reports, tracking, planning and forecasting that council leadership can use for decision-making.':
    'පද්ධතියේ රැස්වන තොරතුරු ඇසුරින් වාර්තා සකස් කිරීම, කාර්ය සාධනය නිරීක්ෂණය කිරීම සහ ඉදිරි සැලසුම් සඳහා අවශ්ය තොරතුරු ලබාගැනීම පහසු කරයි.',
  'Tax Collection & Revenue': 'බදු සහ ආදායම් කළමනාකරණය',
  'Manages assessments, bills, collections and arrears, with every revenue record linked to a real mapped property.':
    'දේපළවලට අදාළ බදු තක්සේරු, බිල්පත්, ගෙවීම් සහ හිඟ මුදල් කළමනාකරණය කිරීම සඳහා පහසුකම් සලසන අතර, එම තොරතුරු අදාළ දේපළ සමඟ සම්බන්ධ කර තබාගත හැකිය.',
  'Acquisition of Certificates': 'සහතිකපත් ලබාගැනීම',
  'Verifies, approves and issues Street Line Certificates and similar municipal documents digitally with complete audit trails.':
    'වීථි රේඛා සහතික ඇතුළු පළාත් පාලන ආයතන මඟින් නිකුත් කරන සහතිකපත් සඳහා අයදුම් කිරීම, තොරතුරු පරීක්ෂා කිරීම, අනුමැතිය ලබාදීම සහ සහතික නිකුත් කිරීම ඩිජිටල් ක්රමයට සිදුකළ හැකිය.',
  'Process & Document Management': 'කාර්ය ක්රියාවලි සහ ලේඛන කළමනාකරණය',
  'Manages internal documents, approval workflows and audit trails so information does not get lost while moving between departments and officers.':
    'අභ්යන්තර ලේඛන, අනුමැති ක්රියාවලි සහ නිලධාරීන් අතර හුවමාරු වන තොරතුරු ක්රමානුකූලව කළමනාකරණය කරමින්, ලේඛන අස්ථානගත වීම සහ අනවශ්ය ප්රමාදයන් අවම කිරීමට උපකාරී වේ.',
  'Explore from the map': 'සිතියමෙන් ගවේෂණය කරන්න',
  'GIS integration': 'භූගෝලීය තොරතුරු පද්ධති ඒකාබද්ධ කිරීම',
  'The map that ties it all together.': 'සියලු තොරතුරු එකට ගෙන එන සිතියම.',
  'The map that ties': 'සියලු තොරතුරු එකට',
  'it all together.': 'ගෙන එන සිතියම.',
  'Geographic Information System integration lets spatial data drive planning, permitting, revenue management and service delivery across the council instead of remaining disconnected between departments.':
    'භූගෝලීය තොරතුරු පද්ධතිය (GIS) මඟින් ඉඩම් සහ ස්ථානීය තොරතුරු නගර සැලසුම්, බලපත්ර නිකුත් කිරීම, ආදායම් කළමනාකරණය සහ මහජන සේවාවන් සමඟ සම්බන්ධ කරයි. එමඟින් විවිධ අංශවලට එකම තොරතුරු පදනමක් මත වඩාත් කාර්යක්ෂමව කටයුතු කළ හැකිය.',
  "Geographic Information System integration lets\r\n                spatial data drive planning, permitting,\r\n                revenue management and service delivery across\r\n                the council instead of remaining disconnected\r\n                between departments.":
    'භූගෝලීය තොරතුරු පද්ධතිය (GIS) මඟින් ඉඩම් සහ ස්ථානීය තොරතුරු නගර සැලසුම්, බලපත්ර නිකුත් කිරීම, ආදායම් කළමනාකරණය සහ මහජන සේවාවන් සමඟ සම්බන්ධ කරයි. එමඟින් විවිධ අංශවලට එකම තොරතුරු පදනමක් මත වඩාත් කාර්යක්ෂමව කටයුතු කළ හැකිය.',
  "Geographic Information System integration lets\n                spatial data drive planning, permitting,\n                revenue management and service delivery across\n                the council instead of remaining disconnected\n                between departments.":
    'භූගෝලීය තොරතුරු පද්ධතිය (GIS) මඟින් ඉඩම් සහ ස්ථානීය තොරතුරු නගර සැලසුම්, බලපත්ර නිකුත් කිරීම, ආදායම් කළමනාකරණය සහ මහජන සේවාවන් සමඟ සම්බන්ධ කරයි. එමඟින් විවිධ අංශවලට එකම තොරතුරු පදනමක් මත වඩාත් කාර්යක්ෂමව කටයුතු කළ හැකිය.',
  'Land & Spatial Intelligence': 'ඉඩම් හා භූගෝලීය තොරතුරු විශ්ලේෂණය',
  'Permits, Certificates & Licensing': 'අවසරපත්‍ර, සහතික සහ බලපත්‍ර',
  'Tax, Revenue & Payments': 'බදු, ආදායම් සහ ගෙවීම්',
  'Citizen Engagement & Command Center': 'පුරවැසි සහභාගීත්වය සහ මෙහෙයුම් මධ්‍යස්ථානය',
  'Land Information System (LIS)': 'ඉඩම් තොරතුරු පද්ධතිය (LIS)',
  'City Planning': 'නගර සැලසුම්කරණය',
  'Underground Utility Management': 'භූගත උපයෝගිතා ජාල කළමනාකරණය',
  'Welcome back.': 'නැවත සාදරයෙන් පිළිගනිමු.',
  'Welcome to LGS': 'LGS වෙත සාදරයෙන් පිළිගනිමු',
  'Create account': 'ගිණුමක් සාදන්න',
  'Create your citizen account to report issues and track service requests.': 'ගැටලු වාර්තා කිරීමට සහ සේවා ඉල්ලීම් නිරීක්ෂණය කිරීමට ඔබගේ පුරවැසි ගිණුම සාදන්න.',
  'Use at least 12 characters.': 'අවම වශයෙන් අක්ෂර 12ක් භාවිතා කරන්න.',

  // 01 | ප්‍රධාන පිටුව — Hero
  'Spatio LGS': 'Spatio LGS',
  'Location Drives Insight': 'ස්ථානයෙන් අවබෝධයට',
  'Governance Evolves': 'අවබෝධයෙන් නව පාලනයකට',
  'Public Services. Local Requests. Municipal Action. One Connected Map.': 'පොදු සේවා. ප්‍රාදේශීය ඉල්ලීම්. පළාත් පාලන ක්‍රියාමාර්ග. මේ සියල්ල එකම සිතියමක.',
  'Spatio LGS is a geospatial decision-support platform built for Municipal and Urban Councils managing real complexity.': 'නගර සභා සහ මහ නගර සභා මුහුණ දෙන සංකීර්ණ අභියෝගවලට ප්‍රායෝගික විසඳුම් ලබාදීම සඳහා නිර්මාණය කළ, භූගෝලීය තොරතුරු පදනම් කරගත් තීරණ ගැනීමේ සහායක වේදිකාවකි Spatio LGS.',
  'Scroll': 'පහළට යන්න',

  // 02 | අපගේ ඉදිරි දැක්ම
  'WHERE WE’RE HEADED': 'අප යන දිශාව',
  'Where we’re headed': 'අප යන දිශාව',
  'WHERE WE\'RE HEADED': 'අප යන දිශාව',
  'Where we\'re headed': 'අප යන දිශාව',
  'One Direction / Two Ways to Say It': 'එකම අරමුණක්, වෙනස් ප්‍රවේශ දෙකක්',
  'One Direction': 'එකම අරමුණක්',
  'Two Ways to Say It': 'වෙනස් ප්‍රවේශ දෙකක්',
  'One Connected Council': 'එකම පද්ධතියකින් සම්බන්ධ වූ සභාවක්',
  'A spatially accurate digital foundation where requests, records and revenue do not get lost between departments.': 'ඉල්ලීම්, ලේඛන සහ ආදායම් තොරතුරු දෙපාර්තමේන්තු අතර අස්ථානගත නොවන, නිවැරදි භූගෝලීය දත්ත මත ගොඩනැගුණු ඒකාබද්ධ ඩිජිටල් පදනමක්.',
  'One Map. Every Department.': 'එකම සිතියමක්. සියලු අංශ සඳහා.',
  'Land records, permits, tax and revenue, certificates and citizen services work from the same verified geographic picture.': 'ඉඩම් වාර්තා, අවසරපත්‍ර, බදු හා ආදායම්, සහතික සහ පුරවැසි සේවා සියල්ල එකම තහවුරු කළ භූගෝලීය දත්ත පදනමක් ඔස්සේ ක්‍රියාත්මක වේ.',

  // 03 | ඒකාබද්ධ වේදිකාව සහ සේවා
  'One connected platform': 'සියල්ල සම්බන්ධ කරන එකම වේදිකාවක්',
  'One Platform. Every Council Function.': 'එකම වේදිකාවක්. සභාවේ සියලු කාර්යයන් සඳහා.',
  'Spatio LGS connects land and spatial intelligence, permits and licensing, tax and revenue, and citizen engagement through one verified geographic foundation.': 'Spatio LGS මඟින් ඉඩම් හා භූගෝලීය තොරතුරු, අවසරපත්‍ර සහ බලපත්‍ර, බදු හා ආදායම් සහ පුරවැසි සහභාගීත්වය යන සියල්ල තහවුරු කළ එකම භූගෝලීය දත්ත පදනමක් මත සම්බන්ධ කරයි.',
  'Land': 'ඉඩම්',
  'Permits': 'අවසරපත්‍ර',
  'Revenue': 'ආදායම්',
  'Engage': 'සම්බන්ධ වෙමු',
  'Connect property and parcel records, boundaries, zoning and spatial intelligence to one verified map.': 'දේපළ සහ ඉඩම් කැබලි පිළිබඳ වාර්තා, මායිම්, කලාපීකරණ තොරතුරු සහ භූගෝලීය දත්ත විශ්ලේෂණය එකම තහවුරු කළ සිතියමකට සම්බන්ධ කරන්න.',
  'View service': 'සේවාව බලන්න',
  'Track applications, approvals, certificates and licensing workflows from submission to final decision.': 'අයදුම්පත ඉදිරිපත් කළ මොහොතේ සිට අවසන් තීරණය දක්වා අනුමැතිය, සහතික සහ බලපත්‍ර නිකුත් කිරීමේ සෑම පියවරක්ම නිරීක්ෂණය කරන්න.',
  'Manage assessments, bills, collections and arrears with every record tied to a real, mapped property.': 'තක්සේරු, බිල්පත්, ආදායම් එකතු කිරීම් සහ හිඟ මුදල් කළමනාකරණය කරන්න. සෑම වාර්තාවක්ම සිතියමේ හඳුනාගත් සැබෑ දේපළකට සම්බන්ධ වේ.',
  'Bring citizen services, complaints, public participation and executive visibility into one connected system.': 'පුරවැසි සේවා, පැමිණිලි, මහජන සහභාගීත්වය සහ කළමනාකරණ අධීක්ෂණය එකම ඒකාබද්ධ පද්ධතියකට ගෙන එන්න.',

  // 04 | භූගෝලීය තොරතුරු පදනම
  'Strong geospatial foundation': 'ශක්තිමත් භූගෝලීය තොරතුරු පදනමක්',
  'Every Layer of the City, Finally in One Place.': 'නගරයේ සියලුම තොරතුරු දැන් එකම තැනක.',
  'Every Layer of the City,': 'නගරයේ සියලුම තොරතුරු ',
  'Finally in One Place.': 'දැන් එකම තැනක.',
  'Spatial foundation': 'භූගෝලීය දත්ත පදනම',
  'Manage municipal assets and infrastructure with real location intelligence instead of guesswork.': 'අනුමාන මත නොව, නිවැරදි ස්ථානීය තොරතුරු මත පදනම්ව සභාවට අයත් වත්කම් සහ යටිතල පහසුකම් කළමනාකරණය කරන්න.',
  'Planning intelligence': 'සැලසුම්කරණයට දත්තමය අවබෝධය',
  'Bring land records, ownership and boundaries together clearly so planning starts from facts, not files.': 'ඉඩම් වාර්තා, හිමිකාරිත්වය සහ මායිම් පිළිබඳ තොරතුරු එකට ගෙන, ලිපිගොනු පමණක් නොව නිවැරදි දත්ත මත නගර සැලසුම් ආරම්භ කරන්න.',
  'Infrastructure intelligence': 'යටිතල පහසුකම් පිළිබඳ දත්තමය අවබෝධය',
  'Map and manage water, sewerage, electricity and telecom networks before anyone breaks ground.': 'කැණීම් ආරම්භ කිරීමට පෙර ජල, මලාපවහන, විදුලි සහ විදුලි සංදේශ ජාල සිතියම්ගත කර නිසි ලෙස කළමනාකරණය කරන්න.',

  // 05 | Spatio LGS තෝරාගත යුත්තේ ඇයි?
  'Why Spatio LGS?': 'Spatio LGS තෝරාගන්නේ ඇයි?',
  'One Filing Cabinet Away From Chaos': 'ලිපිගොනු අතර අතරමං නොවී',
  'From Filing to Finishing': 'ලිපිගොනුවේ සිට අවසන් තීරණය දක්වා',
  'Real-time spatial data and automated workflows can turn long approval chains into faster, more accountable decisions.': 'යාවත්කාලීන භූගෝලීය දත්ත සහ ස්වයංක්‍රීය කාර්ය ප්‍රවාහයන් මඟින් දිගු අනුමැති ක්‍රියාවලි වේගවත්, පැහැදිලි සහ වගකීම් සහිත තීරණ බවට පත් කළ හැක.',
  'Nothing Hidden, Nothing Lost': 'කිසිවක් සැඟවෙන්නේ නැහැ. කිසිවක් මඟහැරෙන්නේ නැහැ.',
  'Every department sees the same data, while citizens can follow their own request instead of wondering where it went.': 'සෑම අංශයකටම එකම යාවත්කාලීන තොරතුරු දැකගත හැකි අතර, පුරවැසියන්ට තම ඉල්ලීමේ ප්‍රගතිය පහසුවෙන් දැනගත හැක.',
  'Decisions Grounded in Reality': 'සැබෑ දත්ත මත ගන්නා තීරණ',
  'Dashboards built on live field data help councils plan from what is actually there, not from assumptions.': 'ක්ෂේත්‍රයෙන් ලැබෙන යාවත්කාලීන දත්ත පෙන්වන පාලන පුවරු මඟින් අනුමාන වෙනුවට සැබෑ තත්ත්වය අනුව සැලසුම් කිරීමට සභාවලට හැකි වේ.',

  // 06 | ක්‍රියාත්මක වන ආකාරය
  'How it works': 'මෙය ක්‍රියාත්මක වන්නේ කෙසේද?',
  'From a Location to a Decision': 'ස්ථානයකින් තීරණයකට',
  '- in Four Steps.': '— පියවර හතරකින්.',
  '— in Four Steps.': '— පියවර හතරකින්.',
  'From a Location to a Decision - in Four Steps.': 'ස්ථානයකින් තීරණයකට — පියවර හතරකින්.',
  'From a Location to a Decision — in Four Steps.': 'ස්ථානයකින් තීරණයකට — පියවර හතරකින්.',
  'Four steps. One system. A council that finally moves as fast as its city does.': 'පියවර හතරක්. එකම පද්ධතියක්. නගරයේ අවශ්‍යතාවලට සරිලන වේගයෙන් ක්‍රියා කරන සභාවක්.',
  'Map It': 'සිතියම්ගත කරන්න',
  'Every parcel, road, building and utility line becomes part of one accurate digital map of the council area.': 'සෑම ඉඩම් කැබැල්ලක්ම, මාර්ගයක්ම, ගොඩනැගිල්ලක්ම සහ උපයෝගිතා ජාලයක්ම සභා බලප්‍රදේශයේ නිවැරදි ඩිජිටල් සිතියමට එක් වේ.',
  'Connect It': 'තොරතුරු සම්බන්ධ කරන්න',
  'Land records, permits, tax data and citizen services all link back to the same map.': 'ඉඩම් වාර්තා, අවසරපත්‍ර, බදු තොරතුරු සහ පුරවැසි සේවා සියල්ල එකම සිතියමකට සම්බන්ධ වේ.',
  'Act On It': 'සේවා ලබාගන්න, ක්‍රියාත්මක වන්න',
  'Citizens access properties, applications, permits, tax dues, complaints, certificates and notifications from one dashboard.': 'පුරවැසියන්ට දේපළ තොරතුරු, අයදුම්පත්, අවසරපත්‍ර, ගෙවිය යුතු බදු, පැමිණිලි, සහතික සහ දැනුම්දීම් එකම පාලන පුවරුවකින් ලබාගත හැක.',
  'Track It': 'ප්‍රගතිය නිරීක්ෂණය කරන්න',
  'Commissioners and division heads can watch revenue, complaints and projects unfold in real time from one dashboard.': 'කොමසාරිස්වරුන්ට සහ අංශ ප්‍රධානීන්ට ආදායම්, පැමිණිලි සහ ව්‍යාපෘතිවල ප්‍රගතිය එකම පාලන පුවරුවකින් යාවත්කාලීනව නිරීක්ෂණය කළ හැක.',

  // 07 | නගර සිතියම
  'Geospatial foundation': 'භූගෝලීය තොරතුරු පදනම',
  'From what’s underground to what’s being planned next — captured, mapped and ready to use.': 'පොළොව යට ඇති ජාලවල සිට ඉදිරියේදී සැලසුම් කරන සංවර්ධන කටයුතු දක්වා — සියල්ල හඳුනාගෙන, සිතියම්ගත කර, භාවිතයට සූදානම්.',
  'From what\'s underground to what\'s being planned next — captured, mapped and ready to use.': 'පොළොව යට ඇති ජාලවල සිට ඉදිරියේදී සැලසුම් කරන සංවර්ධන කටයුතු දක්වා — සියල්ල හඳුනාගෙන, සිතියම්ගත කර, භාවිතයට සූදානම්.',
  'Open the municipal map': 'සභා බලප්‍රදේශයේ සිතියම විවෘත කරන්න',
  'Connected spatial intelligence': 'ඒකාබද්ධ භූගෝලීය දත්ත විශ්ලේෂණය',
  'One Map. Every Department. Every Answer.': 'එකම සිතියමක්. සියලු අංශ. අවශ්‍ය තොරතුරු එකම තැනක.',
  'Mapped municipality view': 'සිතියම්ගත කළ සභා බලප්‍රදේශය',

  // 08 | අවසාන ආරාධනය
  'Ready to transform your council?': 'ඔබේ සභාව නව යුගයකට ගෙන යාමට සූදානම්ද?',
  'Request a demo and meet our team.': 'නිරූපණයක් ඉල්ලා අපගේ කණ්ඩායම හමුවන්න.',
  'See how Spatio LGS can bring land records, permits, revenue, assets and citizen services into one connected geospatial platform.': 'ඉඩම් වාර්තා, අවසරපත්‍ර, ආදායම්, වත්කම් සහ පුරවැසි සේවා එකම භූගෝලීය තොරතුරු වේදිකාවකට සම්බන්ධ කිරීමට Spatio LGS උපකාර වන ආකාරය දැකගන්න.',
  'Explore the map': 'සිතියම ගවේෂණය කරන්න',
  'Request a demo': 'නිරූපණයක් ඉල්ලන්න',

  // 09 | පාදක කොටස — Footer
  'Platform': 'වේදිකාව',
  'Designed for': 'නිර්මාණය කර ඇත්තේ',
  'Municipal & Urban Councils': 'මහ නගර සභා සහ නගර සභා සඳහා',
  'Purpose': 'අරමුණ',
  'Geospatial decision support': 'භූගෝලීය දත්ත පදනම් කරගත් තීරණ ගැනීමට සහාය වීම',
  'SPATIO LGS': 'SPATIO LGS',
  'A location-aware civic platform connecting residents, services, field teams and local government through one shared municipal map.': 'පදිංචිකරුවන්, සේවා, ක්ෂේත්‍ර කණ්ඩායම් සහ පළාත් පාලන ආයතන එකම සභා සිතියමක් ඔස්සේ සම්බන්ධ කරන ස්ථානීය තොරතුරු පදනම් කරගත් ඩිජිටල් වේදිකාවකි.',
  'Explore': 'ගවේෂණය කරන්න',
  'LGS': 'LGS',
  'Connect': 'අප හා සම්බන්ධ වන්න',
  'Weddemulla, Sri Lanka': 'වැද්දෙමුල්ල, ශ්‍රී ලංකාව',
  '+94 11 000 0000': '+94 11 000 0000',
  'hello@lgs.example': 'hello@lgs.example',
  '© 2026 LGS — Local Government Systems': '© 2026 LGS — පළාත් පාලන පද්ධති',
  '© 2026 LGS - Local Government Systems': '© 2026 LGS — පළාත් පාලන පද්ධති',

  // --- Homepage Refresh (New Copy) ---
  // Section 1: Hero
  'SPATIO LGS · LOCATION INTELLIGENCE FOR LOCAL GOVERNMENT': 'SPATIO LGS · පළාත් පාලනය සඳහා භූගෝලීය තොරතුරු බුද්ධිය',
  'Location Drives Insight. Governance Evolves.': 'ස්ථානයෙන් අවබෝධයට. අවබෝධයෙන් නව පාලනයකට.',
  'Location Drives Insight.': 'ස්ථානයෙන් අවබෝධයට.',
  'Governance Evolves.': 'අවබෝධයෙන් නව පාලනයකට.',
  'Spatio LGS brings location intelligence into everyday council operations — helping local authorities manage services, respond to communities, and make informed decisions.': 'Spatio LGS මඟින් සභාවේ එදිනෙදා මෙහෙයුම් සඳහා භූගෝලීය තොරතුරු බුද්ධිය එක් කරයි — පළාත් පාලන ආයතනවලට සේවා කළමනාකරණය කිරීමට, ප්‍රජා අවශ්‍යතාවලට ප්‍රතිචාර දැක්වීමට සහ දත්ත මත පදනම් වූ තීරණ ගැනීමට සහාය වේ.',
  'Explore the Platform': 'වේදිකාව ගවේෂණය කරන්න',
  'Request a Demo': 'නිරූපණයක් ඉල්ලන්න',

  // Section 2: Our Vision
  'One Direction. Two Ways to Make It Happen.': 'එකම අරමුණක් — වෙනස් ප්‍රවේශ දෙකක්',
  'One Direction.': 'එකම අරමුණක්.',
  'Two Ways to Make It Happen.': 'වෙනස් ප්‍රවේශ දෙකක්.',
  'A Council That Works Together': 'එකමුතුව ක්‍රියා කරන සභාවක්',
  'Bring departments, staff, and services into a more coordinated way of working — with clearer responsibilities and fewer disconnected processes.': 'දෙපාර්තමේන්තු, කාර්ය මණ්ඩලය සහ සේවාවන් වඩාත් සම්බන්ධීකරණය වූ ක්‍රමවේදයකට ගෙන එන්න — පැහැදිලි වගකීම් සහ බාධාවකින් තොර කාර්ය ප්‍රවාහයන් සමඟින්.',
  'A City That Makes Sense on the Map': 'සිතියම මත පැහැදිලි වන නගරයක්',
  'Understand properties, infrastructure, and local needs through accurate spatial information that supports planning and service delivery.': 'සැලසුම්කරණය සහ සේවා සැපයීමට සහාය වන නිවැරදි භූගෝලීය දත්ත ඔස්සේ දේපළ, යටිතල පහසුකම් සහ ප්‍රාදේශීය අවශ්‍යතා නිසි ලෙස වටහා ගන්න.',
  'Coordinated Workflows': 'සම්බන්ධීකරණය වූ කාර්ය ප්‍රවාහයන්',
  'Inter-Department Clarity': 'අංශ අතර විනිවිදභාවය',
  'Spatial Verification': 'භූගෝලීය තහවුරු කිරීම',
  'Evidence-Based Planning': 'දත්ත මත සැලසුම්කරණය',

  // Section 3: Platform Capabilities
  'BUILT FOR LOCAL GOVERNMENT': 'පළාත් පාලන ආයතන සඳහාම නිර්මිතයි',
  'The Tools Behind Better Council Services.': 'වඩාත් යහපත් සභා සේවාවන් පිටුපස ඇති මෙවලම්.',
  'From property administration to public requests, Spatio LGS supports the essential work of local authorities through practical digital tools.': 'දේපළ පරිපාලනයේ සිට මහජන ඉල්ලීම් දක්වා, Spatio LGS ප්‍රායෝගික ඩිජිටල් මෙවලම් මඟින් පළාත් පාලන ආයතනවල මූලික කාර්යයන් සවිබල ගන්වයි.',
  'Land & Property': 'ඉඩම් සහ දේපළ',
  'Organize parcels, ownership records, boundaries, and zoning information for more reliable land administration.': 'වඩාත් විශ්වාසදායක ඉඩම් පරිපාලනයක් සඳහා ඉඩම් කැබලි, හිමිකාරිත්ව වාර්තා, මායිම් සහ කලාපීකරණ තොරතුරු ක්‍රමවත්ව සංවිධානය කරන්න.',
  'Permits & Licensing': 'අවසරපත්‍ර සහ බලපත්‍ර',
  'Manage applications, reviews, approvals, and certificates with clear progress tracking.': 'පැහැදිලි ප්‍රගති අධීක්ෂණයක් සමඟින් අයදුම්පත්, සමාලෝචන, අනුමැතීන් සහ සහතිකපත් කාර්යක්ෂමව කළමනාකරණය කරන්න.',
  'Revenue & Payments': 'ආදායම් සහ ගෙවීම්',
  'Keep assessments, billing, collections, and outstanding payments organized around property records.': 'තක්සේරු, බිල්පත්, එකතු කිරීම් සහ හිඟ ගෙවීම් දේපළ වාර්තා සමඟ සම්බන්ධ කර පිළිවෙළකට පවත්වා ගන්න.',
  'Citizen Services': 'පුරවැසි සේවා',
  'Give residents a clearer way to submit requests, report issues, and follow the progress of council services.': 'ඉල්ලීම් ඉදිරිපත් කිරීමට, ගැටලු වාර්තා කිරීමට සහ සභා සේවාවල ප්‍රගතිය නිරීක්ෂණය කිරීමට පුරවැසියන්ට වඩාත් පැහැදිලි මඟක් සලසන්න.',
  'Explore Service': 'සේවාව ගවේෂණය කරන්න',

  // Section 4: Geospatial Intelligence
  'THE GEOSPATIAL ADVANTAGE': 'භූගෝලීය තොරතුරු තාක්ෂණයේ වාසිය',
  'See What Traditional Records Can\'t Show.': 'සාම්ප්‍රදායික ලේඛනවලින් දැකගත නොහැකි දේ අවබෝධ කරගන්න.',
  'See What Traditional Records Can’t Show.': 'සාම්ප්‍රදායික ලේඛනවලින් දැකගත නොහැකි දේ අවබෝධ කරගන්න.',
  'A map reveals relationships that spreadsheets and filing systems often miss. Spatio LGS helps councils understand where assets are located, how infrastructure connects, and what changes across their areas.': 'ලිපිගොනු සහ පැතුරුම්පත්වලින් මඟහැරෙන අන්තර් සබඳතා සිතියමක් මඟින් මැනවින් හෙළි කරයි. වත්කම් පිහිටි ස්ථාන, යටිතල පහසුකම් සම්බන්ධ වන ආකාරය සහ නගරයේ සිදුවන වෙනස්කම් තේරුම් ගැනීමට Spatio LGS සභාවන්ට උපකාරී වේ.',
  'Land Information System': 'ඉඩම් තොරතුරු පද්ධතිය',
  'Build a clearer picture of properties, parcels, boundaries, and their associated records.': 'දේපළ, ඉඩම් කැබලි, මායිම් සහ ඒවාට අදාළ වාර්තා පිළිබඳ වඩාත් පැහැදිලි චිත්‍රයක් ගොඩනඟන්න.',
  'Urban Planning': 'නාගරික සැලසුම්කරණය',
  'Use land-use patterns, zoning, and development information to support informed planning decisions.': 'දැනුවත් සැලසුම් තීරණ ගැනීමට සහාය වීම සඳහා ඉඩම් පරිහරණ රටා, කලාපීකරණය සහ සංවර්ධන තොරතුරු භාවිතා කරන්න.',
  'Utility Network Management': 'උපයෝගිතා ජාල කළමනාකරණය',
  'Locate and understand underground water, sewerage, electricity, and telecommunications networks.': 'භූගත ජල, මලාපවහන, විදුලි සහ විදුලි සංදේශ ජාල නිවැරදිව හඳුනාගෙන කළමනාකරණය කරන්න.',
  'Spatial Base': 'භූගෝලීය පදනම',
  'Planning Intelligence': 'සැලසුම්කරණ බුද්ධිය',
  'Infrastructure Networks': 'යටිතල පහසුකම් ජාල',

  // Section 5: Why Spatio LGS
  'Less Friction. More Progress.': 'අවම බාධා. උපරිම ප්‍රගතිය.',
  'Move Work Forward': 'කාර්යයන් වේගවත් කරන්න',
  'Reduce repetitive administration and help applications move through each stage with clearer ownership and fewer delays.': 'පුනරාවර්තී ලිපිකරු කටයුතු අවම කර, පැහැදිලි වගකීම් සහ අවම ප්‍රමාදයන් සහිතව අයදුම්පත් එක් එක් අදියර ඔස්සේ ඉදිරියට ගෙන යන්න.',
  'Make Progress Visible': 'ප්‍රගතිය විනිවිදව පෙන්වන්න',
  'Give staff and residents a clearer understanding of request status, pending actions, and next steps.': 'ඉල්ලීම්වල තත්ත්වය, ඉතිරිව ඇති ක්‍රියාමාර්ග සහ මීළඟ පියවර පිළිබඳව කාර්ය මණ්ඩලයට මෙන්ම පුරවැසියන්ටත් පැහැදිලි අවබෝධයක් ලබාදෙන්න.',
  'Plan With Confidence': 'විශ්වාසයෙන් යුතුව සැලසුම් කරන්න',
  'Identify service gaps, review local trends, and prioritize work using recorded information and geographic context.': 'වාර්තාගත තොරතුරු සහ භූගෝලීය පසුබිම උපයෝගී කරගනිමින් සේවා හිඩැස් හඳුනාගන්න, ප්‍රවණතා විශ්ලේෂණය කරන්න සහ ප්‍රමුඛතා අනුව කටයුතු කරන්න.',

  // Section 6: How It Works
  'From Local Information to Meaningful Action.': 'ප්‍රාදේශීය තොරතුරුවලින් අර්ථවත් ක්‍රියාමාර්ගයකට.',
  'A simple process that turns geographic information and everyday council activity into coordinated work.': 'භූගෝලීය දත්ත සහ සභාවේ එදිනෙදා ක්‍රියාකාරකම් ඒකාබද්ධ කාර්යයන් බවට පත් කරන සරල ක්‍රියාවලියකි.',
  'Map the Area': 'ප්‍රදේශය සිතියම්ගත කරන්න',
  'Capture properties, roads, buildings, and infrastructure in a geographic information system.': 'දේපළ, මාර්ග, ගොඩනැගිලි සහ යටිතල පහසුකම් භූගෝලීය තොරතුරු පද්ධතියකට ඇතුළත් කරන්න.',
  'Link the Records': 'වාර්තා සම්බන්ධ කරන්න',
  'Associate council records and service information with their relevant locations.': 'සභාවේ ලේඛන සහ සේවා තොරතුරු අදාළ නිශ්චිත ස්ථාන සමඟ සම්බන්ධ කරන්න.',
  'Deliver the Service': 'සේවාව ලබාදෙන්න',
  'Process applications, respond to requests, and coordinate tasks across the responsible teams.': 'අයදුම්පත් ක්‍රියාත්මක කරන්න, ඉල්ලීම්වලට ප්‍රතිචාර දක්වන්න සහ අදාළ කණ්ඩායම් අතර කාර්යයන් සම්බන්ධීකරණය කරන්න.',
  'Review the Results': 'ප්‍රතිඵල සමාලෝචනය කරන්න',
  'Monitor progress, identify outstanding work, and use reports to guide the next decision.': 'ප්‍රගතිය නිරීක්ෂණය කරන්න, ඉතිරිව ඇති කාර්යයන් හඳුනාගන්න සහ මීළඟ තීරණ සඳහා වාර්තා උපයෝගී කරගන්න.',

  // Section 7: Interactive Map Preview
  'EXPLORE SPATIO LGS': 'Spatio LGS ගවේෂණය කරන්න',
  'Your Council Area, From a New Perspective.': 'ඔබේ සභා බලප්‍රදේශය — නවමු දැක්මකින්.',
  'Explore how geographic information can bring properties, infrastructure, and council activities into a clearer view.': 'භූගෝලීය තොරතුරු මඟින් දේපළ, යටිතල පහසුකම් සහ සභාවේ ක්‍රියාකාරකම් වඩාත් පැහැදිලිව දැකගත හැකි ආකාරය ගවේෂණය කරන්න.',
  'Properties': 'දේපළ',
  'Land Use': 'ඉඩම් පරිහරණය',
  'Roads': 'මාර්ග',
  'Public Assets': 'පොදු වත්කම්',
  'Explore the Municipal Map': 'සභා බලප්‍රදේශයේ සිතියම ගවේෂණය කරන්න',
  'Registered Cadastral Parcels': 'ලියාපදිංචි කැඩැස්ට්‍රල් බිම් කොටස්',
  'Municipal Spatial Grid · Colombo GIS': 'නාගරික අවකාශීය ජාලය · Colombo GIS',

  // Section 8: Final CTA
  'TAKE THE NEXT STEP': 'මීළඟ පියවර තබන්න',
  'Ready to Rethink How Your Council Works?': 'ඔබේ සභාව ක්‍රියාත්මක වන ආකාරය නව මඟකට ගැනීමට සූදානම්ද?',
  'Discover how Spatio LGS can support your council\'s day-to-day operations and long-term planning.': 'ඔබේ සභාවේ එදිනෙදා මෙහෙයුම් සහ දිගුකාලීන සැලසුම්කරණයට Spatio LGS සහාය වන ආකාරය සොයා බලන්න.',
  'Discover how Spatio LGS can support your council’s day-to-day operations and long-term planning.': 'ඔබේ සභාවේ එදිනෙදා මෙහෙයුම් සහ දිගුකාලීන සැලසුම්කරණයට Spatio LGS සහාය වන ආකාරය සොයා බලන්න.',
  'Contact Our Team': 'අපගේ කණ්ඩායම අමතන්න',
  'Location intelligence for more responsive, informed, and coordinated local government.': 'වඩාත් කාර්යක්ෂම, දැනුවත් සහ සම්බන්ධීකරණය වූ පළාත් පාලනයක් සඳහා ස්ථානීය තොරතුරු තාක්ෂණය.',

  // Section 9: Contact Page & Editorial Form
  'Prefer to reach us directly?': 'අපව සෘජුවම සම්බන්ධ කර ගැනීමට කැමතිද?',
  'PREFER TO REACH US DIRECTLY?': 'අපව සෘජුවම සම්බන්ධ කර ගැනීමට කැමතිද?',
  'Talk to an expert.': 'විශේෂඥයෙකු සමඟ කතා කරන්න.',
  'TALK TO AN EXPERT.': 'විශේෂඥයෙකු සමඟ කතා කරන්න.',
  'Tell us about your council, the services you want to improve and the problems you are hoping to solve. Our team can walk you through how Spatio LGS can work in your own council area.': 'ඔබේ සභාව, ඔබට වැඩිදියුණු කිරීමට අවශ්‍ය සේවාවන් සහ විසඳීමට බලාපොරොත්තු වන ගැටළු ගැන අපට කියන්න. ඔබේ සභා බලප්‍රදේශය තුළ Spatio LGS ක්‍රියාත්මක වන ආකාරය පිළිබඳව අපගේ කණ්ඩායමට ඔබට පැහැදිලි කළ හැකිය.',
  'Office': 'කාර්යාලය',
  'OFFICE': 'කාර්යාලය',
  'Head office': 'ප්‍රධාන කාර්යාලය',
  'No. 44, Beddagana South Road, Pitakotte': 'නො. 44, බැද්දගාන දකුණු පාර, පිටකෝට්ටේ',
  'Platform demos, council implementation and solution discussions': 'වේදිකා නිරූපණ, සභා ක්‍රියාත්මක කිරීම් සහ විසඳුම් සාකච්ඡා',
  'Full name': 'සම්පූර්ණ නම',
  'FULL NAME': 'සම්පූර්ණ නම',
  'Your full name': 'ඔබගේ සම්පූර්ණ නම',
  'Primary service need': 'ප්‍රධාන සේවා අවශ්‍යතාවය',
  'PRIMARY SERVICE NEED': 'ප්‍රධාන සේවා අවශ්‍යතාවය',
  'Land, tax, permits, complaints...': 'ඉඩම්, බදු, බලපත්‍ර, පැමිණිලි...',
  'What are you hoping to solve?': 'ඔබ විසඳීමට බලාපොරොත්තු වන්නේ කුමක්ද?',
  'WHAT ARE YOU HOPING TO SOLVE?': 'ඔබ විසඳීමට බලාපොරොත්තු වන්නේ කුමක්ද?',
  'Tell us about your council, current challenges and what you would like to improve…': 'ඔබේ සභාව, පවතින අභියෝග සහ ඔබ වැඩිදියුණු කිරීමට කැමති දේ ගැන අපට කියන්න...',
  'Tell us about your council, current challenges and what you would like to improve...': 'ඔබේ සභාව, පවතින අභියෝග සහ ඔබ වැඩිදියුණු කිරීමට කැමති දේ ගැන අපට කියන්න...',
  'Council implementation': 'සභා ක්‍රියාත්මක කිරීම්',
  'A connected platform for Municipal and Urban Council operations.': 'මහනගර සභා සහ නගර සභා මෙහෙයුම් සඳහා සම්බන්ධිත වේදිකාවකි.',
  'Geospatial foundation': 'භූ-අවකාශීය පදනම',
  'One verified map': 'එක් තහවුරු කළ සිතියමක්',
  'Bring land, infrastructure, services and operational information together spatially.': 'ඉඩම්, යටිතල පහසුකම්, සේවා සහ මෙහෙයුම් තොරතුරු අවකාශීයව එකට එක් කරන්න.',
  'Decision support': 'තීරණ ගැනීමේ සහාය',
  'Connected governance': 'සම්බන්ධිත පාලනය',
  'Support council teams with secure, role-based information and shared operational visibility.': 'ආරක්ෂිත, භූමිකාව පදනම් කරගත් තොරතුරු සහ හවුල් මෙහෙයුම් දෘශ්‍යතාව සමඟ සභා කණ්ඩායම් සවිබල ගන්වන්න.',
  'Let’s put your council': 'ඔබේ සභාව',
  'on the map.': 'සිතියමට එක් කරමු.',
  'Talk to the Spatio LGS team about your council’s needs, existing challenges and how a connected geospatial platform can support better local government operations.': 'ඔබේ සභාවේ අවශ්‍යතා, පවතින අභියෝග සහ වඩා හොඳ පළාත් පාලන මෙහෙයුම් සඳහා සම්බන්ධිත භූ-අවකාශීය වේදිකාවක් සහාය වන ආකාරය පිළිබඳව Spatio LGS කණ්ඩායම සමඟ සාකච්ඡා කරන්න.',
  'Scroll': 'පහළට යන්න',
  'Sending message...': 'පණිවිඩය යවමින්...',
  'Message sent successfully': 'පණිවිඩය සාර්ථකව යවන ලදී',
  'Thank you for reaching out. We have received your inquiry and our team will get back to you shortly.': 'අප හා සම්බන්ධ වීම ගැන ඔබට ස්තුතියි. ඔබගේ විමසීම අප වෙත ලැබී ඇති අතර අපගේ කණ්ඩායම ඉක්මනින් ඔබව සම්බන්ධ කර ගනු ඇත.',
  'Unable to send the request.': 'ඉල්ලීම යැවීමට නොහැකි විය.',
  'Failed to send your message. Please try again.': 'ඔබගේ පණිවිඩය යැවීමට නොහැකි විය. කරුණාකර නැවත උත්සාහ කරන්න.',
  'OK': 'හරි',

  // Request Detail Page & Evidence & Workflow
  'Status history': 'තත්ත්ව ඉතිහාසය',
  'STATUS HISTORY': 'තත්ත්ව ඉතිහාසය',
  'Request timeline': 'ඉල්ලීම් කාලරාමුව',
  'Request overview': 'ඉල්ලීම් දළ විශ්ලේෂණය',
  'Selected workflow stage': 'තෝරාගත් කාර්ය ප්‍රවාහ අදියර',
  'request': 'ඉල්ලීමක්',
  'requests': 'ඉල්ලීම්',
  'Submitted': 'ඉදිරිපත් කරන ලදී',
  'Pinned map location': 'සිතියම්ගත කළ ස්ථානය',
  'Assigned officer': 'පැවරුම් ලද නිලධාරියා',
  'Not assigned': 'පවරා නැත',
  'Evidence': 'සාක්ෂි',
  'EVIDENCE': 'සාක්ෂි',
  'Photos & documents': 'ඡායාරූප සහ ලේඛන',
  'Complaint evidence': 'පැමිණිල්ලේ සාක්ෂි',
  'Evidence submitted with the original complaint': 'මුල් පැමිණිල්ල සමඟ ඉදිරිපත් කළ සාක්ෂි',
  'No complaint evidence attached': 'පැමිණිල්ලට අදාළ සාක්ෂි අමුණා නැත',
  'Field officer evidence': 'ක්ෂේත්‍ර නිලධාරී සාක්ෂි',
  'Evidence collected during inspection and field work': 'පරීක්ෂණ සහ ක්ෂේත්‍ර කටයුතු අතරතුර රැස් කරන ලද සාක්ෂි',
  'No field officer evidence uploaded yet': 'ක්ෂේත්‍ර නිලධාරී සාක්ෂි තවමත් එක් කර නැත',
  'Inspection': 'පරීක්ෂාව',
  'INSPECTION': 'පරීක්ෂාව',
  'No inspection notes added yet.': 'තවමත් පරීක්ෂණ සටහන් එක් කර නැත.',
  'Open on map': 'සිතියමෙන් බලන්න',
  'Ownership': 'හිමිකාරිත්වය',
  'OWNERSHIP': 'හිමිකාරිත්වය',
  'Field completion evidence': 'ක්ෂේත්‍ර වැඩ අවසන් කිරීමේ සාක්ෂි',
  'Inspection evidence': 'පරීක්ෂණ සාක්ෂි',
  'Continue inspection': 'පරීක්ෂාව ඉදිරියට ගෙන යන්න',
  'Start inspection': 'පරීක්ෂාව ආරම්භ කරන්න',
  'Field completion': 'ක්ෂේත්‍ර වැඩ අවසන් කිරීම',
  'FIELD COMPLETION': 'ක්ෂේත්‍ර වැඩ අවසන් කිරීම',
  'Inspection summary *': 'පරීක්ෂණ සාරාංශය *',
  'Action taken': 'ගත් ක්‍රියාමාර්ග',
  'Recommendation': 'නිර්දේශය',
  'Any recommendation for the administrator?': 'පරිපාලක සඳහා කිසියම් නිර්දේශයක් තිබේද?',
  'What action was taken at the site?': 'අදාළ ස්ථානයේදී ගත් ක්‍රියාමාර්ග මොනවාද?',
  'Describe what you found during the inspection...': 'පරීක්ෂාවේදී ඔබ නිරීක්ෂණය කළ කරුණු විස්තර කරන්න...',
  'This note is for internal municipal use.': 'මෙම සටහන අභ්‍යන්තර නගර සභා භාවිතය සඳහා පමණි.',
  'Inspection note': 'පරීක්ෂණ සටහන',
  'Enter observations from the inspection...': 'පරීක්ෂාවේ නිරීක්ෂණ ඇතුළත් කරන්න...',
  'Save note': 'සටහන සුරකින්න',
  'Finish field work': 'ක්ෂේත්‍ර වැඩ අවසන් කරන්න',
  'Submit field report': 'ක්ෂේත්‍ර වාර්තාව ඉදිරිපත් කරන්න',
  'Finish this case': 'මෙම නඩුව අවසන් කරන්න',
  'Final review': 'අවසාන සමාලෝචනය',
  'FINAL REVIEW': 'අවසාන සමාලෝචනය',
  'Resolution report *': 'විසඳුම් වාර්තාව *',
  'Explain how the complaint was resolved...': 'පැමිණිල්ල විසඳූ ආකාරය පැහැදිලි කරන්න...',
  'Mark as finished': 'අවසන් කළ ලෙස සලකුණු කරන්න',
  'Mark case as finished': 'නඩුව අවසන් කළ ලෙස සලකුණු කරන්න',
  'Assign / reassign officer': 'නිලධාරියෙකු පවරන්න / නැවත පවරන්න',
  'Escalate for approval': 'අනුමැතිය සඳහා යොමු කරන්න',
  'Approval decision': 'අනුමැතියේ තීරණය',
  'Review the requested action': 'ඉල්ලූ ක්‍රියාමාර්ගය සමාලෝචනය කරන්න',
  'Approve request': 'ඉල්ලීම අනුමත කරන්න',
  'Request information': 'තොරතුරු විමසන්න',
  'Reject request': 'ඉල්ලීම ප්‍රතික්ෂේප කරන්න',
  'Officer assignment': 'නිලධාරී පැවරුම',
  'Assign this request': 'මෙම ඉල්ලීම පවරන්න',
  'Current officer': 'වත්මන් නිලධාරියා',
  'Search worker by name or ID...': 'නම හෝ හැඳුනුම් අංකය මඟින් සේවකයෙකු සොයන්න...',
  'No matching workers': 'ගැලපෙන සේවකයින් නොමැත',
  'Try another worker name or ID.': 'වෙනත් සේවක නමක් හෝ හැඳුනුම් අංකයක් උත්සාහ කරන්න.',
  'Assigning to': 'පවරනු ලබන්නේ',
  'Select a worker to continue.': 'ඉදිරියට යාමට සේවකයෙකු තෝරන්න.',
  'Assigning': 'පවරමින්...',
  'Assign officer': 'නිලධාරියා පවරන්න',
  'Close assignment': 'පැවරුම වසන්න',
  'Submitted by complainant': 'පැමිණිලිකරු විසින් ඉදිරිපත් කරන ලදී',
  'File': 'ගොනුව',
  'URGENT': 'හදිසි',
  'HIGH': 'ඉහළ',
  'MEDIUM': 'මධ්‍යම',
  'LOW': 'අඩු',
  'Urgent': 'හදිසි',
  'High': 'ඉහළ',
  'Medium': 'මධ්‍යම',
  'Low': 'අඩු',
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

// Precomputed lowercase lookup maps to eliminate O(N) loops during translation
const lowerPhraseMap: Record<string, string> = {}
for (const [key, value] of Object.entries(phraseMap)) {
  lowerPhraseMap[key.toLowerCase()] = value
}

const lowerReversePhraseMap: Record<string, string> = {}
for (const [key, value] of Object.entries(reversePhraseMap)) {
  lowerReversePhraseMap[key.toLowerCase()] = value
}

const SINHALA_MONTHS: Record<string, string> = {
  Jan: 'ජන',
  Feb: 'පෙබ',
  Mar: 'මාර්තු',
  Apr: 'අප්‍රේල්',
  May: 'මැයි',
  Jun: 'ජූනි',
  Jul: 'ජූලි',
  Aug: 'අගෝ',
  Sep: 'සැප්',
  Oct: 'ඔක්',
  Nov: 'නොවැ',
  Dec: 'දෙසැ',
}

const REVERSE_SINHALA_MONTHS: Record<string, string> = {
  'ජන': 'Jan',
  'පෙබ': 'Feb',
  'මාර්තු': 'Mar',
  'අප්‍රේල්': 'Apr',
  'මැයි': 'May',
  'ජූනි': 'Jun',
  'ජූලි': 'Jul',
  'අගෝ': 'Aug',
  'සැප්': 'Sep',
  'ඔක්': 'Oct',
  'නොවැ': 'Nov',
  'දෙසැ': 'Dec',
}

// In-memory memoization cache for fast O(1) translation lookup
const translationMemoCache = new Map<string, string>()

/**
 * Translates text bidirectionally between English and Sinhala.
 * Preserves place names, personal names, codes, dates, and technical formats untouched.
 */
export function translateText(text: string, lang: Language): string {
  if (!text) return text
  const trimmed = text.trim()
  if (!trimmed) return text

  const normalized = trimmed.replace(/\s+/g, ' ')
  const cacheKey = `${lang}:${normalized}`
  const cached = translationMemoCache.get(cacheKey)
  if (cached !== undefined) {
    return text.replace(trimmed, cached)
  }

  let translated: string | null = null

  if (lang === 'en') {
    // If the text is Sinhala, convert it back to English
    if (reversePhraseMap[trimmed]) {
      translated = reversePhraseMap[trimmed]
    } else if (reversePhraseMap[normalized]) {
      translated = reversePhraseMap[normalized]
    } else if (lowerReversePhraseMap[trimmed.toLowerCase()]) {
      translated = lowerReversePhraseMap[trimmed.toLowerCase()]
    } else if (lowerReversePhraseMap[normalized.toLowerCase()]) {
      translated = lowerReversePhraseMap[normalized.toLowerCase()]
    } else {
      // Dynamic patterns in reverse
      const submittedMatchSi = normalized.match(/^([A-Z0-9-]+)\s+සාර්ථකව ඉදිරිපත් කර ඇත\.$/)
      if (submittedMatchSi) {
        translated = `${submittedMatchSi[1]} has been submitted successfully.`
      } else {
        const completedReportMatchSi = normalized.match(/^([A-Z0-9-]+)\s+සම්පූර්ණ කර ඇත\.\s+විසඳුම් වාර්තාව බැලීමට ඉල්ලීම විවෘත කරන්න\.$/)
        if (completedReportMatchSi) {
          translated = `${completedReportMatchSi[1]} has been completed. Open the request to view the resolution report.`
        } else {
          const inspectStartedCompletedMatchSi = normalized.match(/^([A-Z0-9-]+)\s+පරීක්ෂාව\s+(ආරම්භ කරන ලදී|සම්පූර්ණ කරන ලදී)\.$/)
          if (inspectStartedCompletedMatchSi) {
            const action = inspectStartedCompletedMatchSi[2] === 'ආරම්භ කරන ලදී' ? 'started' : 'completed'
            translated = `${inspectStartedCompletedMatchSi[1]} inspection has been ${action}.`
          } else {
            const inspectScheduledMatchSi = normalized.match(/^([A-Z0-9-]+)\s+සඳහා පරීක්ෂණයක් සැලසුම් කර ඇත\.$/)
            if (inspectScheduledMatchSi) {
              translated = `An inspection has been scheduled for ${inspectScheduledMatchSi[1]}.`
            } else {
              const daysAgoMatchSi = normalized.match(/^දින\s+(\d+)කට පෙර$/)
              if (daysAgoMatchSi) {
                translated = `${daysAgoMatchSi[1]} days ago`
              } else {
                const hrAgoMatchSi = normalized.match(/^පැය\s+(\d+)කට පෙර$/)
                if (hrAgoMatchSi) {
                  translated = `${hrAgoMatchSi[1]} hr${hrAgoMatchSi[1] === '1' ? '' : 's'} ago`
                } else {
                  const minAgoMatchSi = normalized.match(/^මිනිත්තු\s+(\d+)කට පෙර$/)
                  if (minAgoMatchSi) {
                    translated = `${minAgoMatchSi[1]} min ago`
                  } else {
                    const greetingMatchSi = trimmed.match(/^සුබ දහවලක්,\s+(.+)\.$/)
                    if (greetingMatchSi) {
                      translated = `Good afternoon, ${greetingMatchSi[1]}.`
                    } else {
                      const wardPulseMatchSi = trimmed.match(/^(Ward\s+\d+)\s+සක්‍රියතාව$/)
                      if (wardPulseMatchSi) {
                        translated = `${wardPulseMatchSi[1]} pulse`
                      } else {
                      const dateMonthDayTimeMatchSi = normalized.match(/^(ජන|පෙබ|මාර්තු|අප්‍රේල්|මැයි|ජූනි|ජූලි|අගෝ|සැප්|ඔක්|නොවැ|දෙසැ)\s+(\d{1,2}),\s+(\d{1,2}:\d{2}(?:\s*[APap][Mm])?)$/)
                      if (dateMonthDayTimeMatchSi) {
                        const enMonth = REVERSE_SINHALA_MONTHS[dateMonthDayTimeMatchSi[1]] || dateMonthDayTimeMatchSi[1]
                        translated = `${enMonth} ${dateMonthDayTimeMatchSi[2]}, ${dateMonthDayTimeMatchSi[3]}`
                      } else {
                        const searchingForMatchSi = trimmed.match(/^"(.+)" සොයමින් පවතී\.\.\.$/)
                        if (searchingForMatchSi) {
                          translated = `Searching for "${searchingForMatchSi[1]}"...`
                        } else {
                          const resultsForMatchSi = trimmed.match(/^"(.+)" සඳහා ප්‍රතිඵල$/)
                          if (resultsForMatchSi) {
                            translated = `Results for "${resultsForMatchSi[1]}"`
                          } else {
                            const buildingsNearMatchSi = trimmed.match(/^(.+)\s+සිට මීටර් 250ක් ඇතුළත ගොඩනැගිලි$/)
                            if (buildingsNearMatchSi) {
                              translated = `Buildings within 250 m of ${buildingsNearMatchSi[1]}`
                            } else {
                              const buildingCountMatchSi = trimmed.match(/^(\d+)\s+(ගොඩනැගිල්ල|ගොඩනැගිලි)$/)
                              if (buildingCountMatchSi) {
                                const count = buildingCountMatchSi[1]
                                translated = `${count} ${count === '1' ? 'building' : 'buildings'}`
                              } else if (trimmed.startsWith('LGS / ')) {
                                const sub = trimmed.slice(6).trim()
                                if (reversePhraseMap[sub]) {
                                  translated = `LGS / ${reversePhraseMap[sub]}`
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

    const finalVal = translated ?? trimmed
    translationMemoCache.set(cacheKey, finalVal)
    return text.replace(trimmed, finalVal)
  }

  // lang === 'si'
  // 1. Strict preservation check for names, places, and IDs
  if (isPreservedEntity(trimmed) || isPreservedEntity(normalized)) {
    translationMemoCache.set(cacheKey, trimmed)
    return text
  }

  // 2. Exact match in dictionary
  if (phraseMap[trimmed]) {
    translated = phraseMap[trimmed]
  } else if (phraseMap[normalized]) {
    translated = phraseMap[normalized]
  } else if (lowerPhraseMap[trimmed.toLowerCase()]) {
    translated = lowerPhraseMap[trimmed.toLowerCase()]
  } else if (lowerPhraseMap[normalized.toLowerCase()]) {
    translated = lowerPhraseMap[normalized.toLowerCase()]
  }

  if (translated) {
    translationMemoCache.set(cacheKey, translated)
    return text.replace(trimmed, translated)
  }

  // Relative times & dates
  if (/^Just now$/i.test(normalized)) {
    const res = 'දැන්'
    translationMemoCache.set(cacheKey, res)
    return text.replace(trimmed, res)
  }

  const minAgoMatch = normalized.match(/^(\d+)\s+min\s+ago$/i)
  if (minAgoMatch) {
    const res = `මිනිත්තු ${minAgoMatch[1]}කට පෙර`
    translationMemoCache.set(cacheKey, res)
    return text.replace(trimmed, res)
  }

  const hrAgoMatch = normalized.match(/^(\d+)\s+hrs?\s+ago$/i)
  if (hrAgoMatch) {
    const res = `පැය ${hrAgoMatch[1]}කට පෙර`
    translationMemoCache.set(cacheKey, res)
    return text.replace(trimmed, res)
  }

  if (/^Yesterday$/i.test(normalized)) {
    const res = 'ඊයේ'
    translationMemoCache.set(cacheKey, res)
    return text.replace(trimmed, res)
  }

  const daysAgoMatch = normalized.match(/^(\d+)\s+days?\s+ago$/i)
  if (daysAgoMatch) {
    const res = `දින ${daysAgoMatch[1]}කට පෙර`
    translationMemoCache.set(cacheKey, res)
    return text.replace(trimmed, res)
  }

  // Date formats: e.g. "Oct 5, 2026", "Oct 5, 2026, 2:30 PM", or "5 Oct 2026"
  const dateMonthFirstMatch = normalized.match(/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{1,2}),\s+(\d{4})(?:(?:,|\s+at)?\s+(\d{1,2}:\d{2}(?:\s*[APap][Mm])?))?$/i)
  if (dateMonthFirstMatch) {
    const monthRaw = dateMonthFirstMatch[1].slice(0, 3)
    const monthKey = monthRaw.charAt(0).toUpperCase() + monthRaw.slice(1).toLowerCase()
    const sinhalaMonth = SINHALA_MONTHS[monthKey] || monthKey
    const day = dateMonthFirstMatch[2]
    const year = dateMonthFirstMatch[3]
    const time = dateMonthFirstMatch[4]
    const res = time ? `${year} ${sinhalaMonth} ${day}, ${time}` : `${year} ${sinhalaMonth} ${day}`
    translationMemoCache.set(cacheKey, res)
    return text.replace(trimmed, res)
  }

  const dateDayFirstMatch = normalized.match(/^(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{4})(?:(?:,|\s+at)?\s+(\d{1,2}:\d{2}(?:\s*[APap][Mm])?))?$/i)
  if (dateDayFirstMatch) {
    const day = dateDayFirstMatch[1]
    const monthRaw = dateDayFirstMatch[2].slice(0, 3)
    const monthKey = monthRaw.charAt(0).toUpperCase() + monthRaw.slice(1).toLowerCase()
    const sinhalaMonth = SINHALA_MONTHS[monthKey] || monthKey
    const year = dateDayFirstMatch[3]
    const time = dateDayFirstMatch[4]
    const res = time ? `${year} ${sinhalaMonth} ${day}, ${time}` : `${year} ${sinhalaMonth} ${day}`
    translationMemoCache.set(cacheKey, res)
    return text.replace(trimmed, res)
  }

  // Date format without year: e.g. "Oct 16, 02:53 PM" or "Oct 16, 2:53 PM"
  const dateMonthDayTimeMatch = normalized.match(/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{1,2})(?:,\s*|\s+)(\d{1,2}:\d{2}(?:\s*[APap][Mm])?)$/i)
  if (dateMonthDayTimeMatch) {
    const monthRaw = dateMonthDayTimeMatch[1].slice(0, 3)
    const monthKey = monthRaw.charAt(0).toUpperCase() + monthRaw.slice(1).toLowerCase()
    const sinhalaMonth = SINHALA_MONTHS[monthKey] || monthKey
    const day = dateMonthDayTimeMatch[2]
    const time = dateMonthDayTimeMatch[3]
    const res = `${sinhalaMonth} ${day}, ${time}`
    translationMemoCache.set(cacheKey, res)
    return text.replace(trimmed, res)
  }

  // Dynamic notification bodies
  // 1. `${CODE} has been submitted successfully.`
  const submittedMatch = normalized.match(/^([A-Z0-9-]+)\s+has been submitted successfully\.$/i)
  if (submittedMatch) {
    const res = `${submittedMatch[1]} සාර්ථකව ඉදිරිපත් කර ඇත.`
    translationMemoCache.set(cacheKey, res)
    return text.replace(trimmed, res)
  }

  // 2. `${CODE} has been completed. Open the request to view the resolution report.`
  const completedReportMatch = normalized.match(/^([A-Z0-9-]+)\s+has been completed\.\s+Open the request to view the resolution report\.$/i)
  if (completedReportMatch) {
    const res = `${completedReportMatch[1]} සම්පූර්ණ කර ඇත. විසඳුම් වාර්තාව බැලීමට ඉල්ලීම විවෘත කරන්න.`
    translationMemoCache.set(cacheKey, res)
    return text.replace(trimmed, res)
  }

  // 3. `${CODE} inspection has been (started|completed).`
  const inspectStartedCompletedMatch = normalized.match(/^([A-Z0-9-]+)\s+inspection has been (started|completed)\.$/i)
  if (inspectStartedCompletedMatch) {
    const code = inspectStartedCompletedMatch[1]
    const action = inspectStartedCompletedMatch[2].toLowerCase() === 'started' ? 'ආරම්භ කරන ලදී' : 'සම්පූර්ණ කරන ලදී'
    const res = `${code} පරීක්ෂාව ${action}.`
    translationMemoCache.set(cacheKey, res)
    return text.replace(trimmed, res)
  }

  // 4. `An inspection has been scheduled for ${CODE}.`
  const inspectScheduledMatch = normalized.match(/^An inspection has been scheduled for\s+([A-Z0-9-]+)\.$/i)
  if (inspectScheduledMatch) {
    const res = `${inspectScheduledMatch[1]} සඳහා පරීක්ෂණයක් සැලසුම් කර ඇත.`
    translationMemoCache.set(cacheKey, res)
    return text.replace(trimmed, res)
  }

  // 5. `${CODE} has been assigned to you.`
  const assignedToYouMatch = normalized.match(/^([A-Z0-9-]+)\s+has been assigned to you\.$/i)
  if (assignedToYouMatch) {
    const res = `${assignedToYouMatch[1]} ඔබට පවරා ඇත.`
    translationMemoCache.set(cacheKey, res)
    return text.replace(trimmed, res)
  }

  // 6. `${CODE} has been reassigned to you.`
  const reassignedToYouMatch = normalized.match(/^([A-Z0-9-]+)\s+has been reassigned to you\.$/i)
  if (reassignedToYouMatch) {
    const res = `${reassignedToYouMatch[1]} නැවත ඔබට පවරා ඇත.`
    translationMemoCache.set(cacheKey, res)
    return text.replace(trimmed, res)
  }

  // 7. `${CODE} has been reassigned to another officer.`
  const reassignedOtherMatch = normalized.match(/^([A-Z0-9-]+)\s+has been reassigned to another officer\.$/i)
  if (reassignedOtherMatch) {
    const res = `${reassignedOtherMatch[1]} වෙනත් නිලධාරියෙකු වෙත නැවත පවරා ඇත.`
    translationMemoCache.set(cacheKey, res)
    return text.replace(trimmed, res)
  }

  // 8. `A different municipal officer has been assigned to ${CODE}.`
  const diffOfficerMatch = normalized.match(/^A different municipal officer has been assigned to\s+([A-Z0-9-]+)\.$/i)
  if (diffOfficerMatch) {
    const res = `${diffOfficerMatch[1]} සඳහා වෙනත් නගර සභා නිලධාරියෙකු පවරන ලදී.`
    translationMemoCache.set(cacheKey, res)
    return text.replace(trimmed, res)
  }

  // 9. `${CODE} has been assigned to a municipal officer.`
  const assignedOfficerMatch = normalized.match(/^([A-Z0-9-]+)\s+has been assigned to a municipal officer\.$/i)
  if (assignedOfficerMatch) {
    const res = `${assignedOfficerMatch[1]} නගර සභා නිලධාරියෙකු වෙත පවරා ඇත.`
    translationMemoCache.set(cacheKey, res)
    return text.replace(trimmed, res)
  }

  // 10. `Additional action is required for ${CODE}. Please review the request details.`
  const actionReqMatch = normalized.match(/^Additional action is required for\s+([A-Z0-9-]+)\.\s+Please review the request details\.$/i)
  if (actionReqMatch) {
    const res = `${actionReqMatch[1]} සඳහා අමතර ක්‍රියාමාර්ග අවශ්‍යයි. කරුණාකර ඉල්ලීමේ විස්තර සමාලෝචනය කරන්න.`
    translationMemoCache.set(cacheKey, res)
    return text.replace(trimmed, res)
  }

  // 11. `${CODE} has been resolved.`
  const resolvedMatch = normalized.match(/^([A-Z0-9-]+)\s+has been resolved\.$/i)
  if (resolvedMatch) {
    const res = `${resolvedMatch[1]} විසඳා ඇත.`
    translationMemoCache.set(cacheKey, res)
    return text.replace(trimmed, res)
  }

  // 12. `${CODE} has been closed.`
  const closedMatch = normalized.match(/^([A-Z0-9-]+)\s+has been closed\.$/i)
  if (closedMatch) {
    const res = `${closedMatch[1]} වසා ඇත.`
    translationMemoCache.set(cacheKey, res)
    return text.replace(trimmed, res)
  }

  // 13. `${CODE} is now ${status}.`
  const isNowMatch = normalized.match(/^([A-Z0-9-]+)\s+is now\s+(.+)\.$/i)
  if (isNowMatch) {
    const code = isNowMatch[1]
    const rawStatus = isNowMatch[2].trim()
    const transStatus = phraseMap[rawStatus] || lowerPhraseMap[rawStatus.toLowerCase()] || rawStatus
    const res = `${code} දැන් ${transStatus} තත්ත්වයේ පවතී.`
    translationMemoCache.set(cacheKey, res)
    return text.replace(trimmed, res)
  }

  // 14. `The assigned field officer checked in for ${CODE}.`
  const checkedInMatch = normalized.match(/^The assigned field officer checked in for\s+([A-Z0-9-]+)\.$/i)
  if (checkedInMatch) {
    const res = `පැවරුම් ලද ක්ෂේත්‍ර නිලධාරියා ${checkedInMatch[1]} ස්ථානයට පැමිණ වාර්තා කරන ලදී.`
    translationMemoCache.set(cacheKey, res)
    return text.replace(trimmed, res)
  }

  // 15. `The field officer has completed work for ${CODE}. Review the field report and finish the case.`
  const completedFieldMatch = normalized.match(/^The field officer has completed work for\s+([A-Z0-9-]+)\.\s+Review the field report and finish the case\.$/i)
  if (completedFieldMatch) {
    const res = `ක්ෂේත්‍ර නිලධාරියා ${completedFieldMatch[1]} සඳහා වන වැඩ සම්පූර්ණ කර ඇත. ක්ෂේත්‍ර වාර්තාව සමාලෝචනය කර නඩුව අවසන් කරන්න.`
    translationMemoCache.set(cacheKey, res)
    return text.replace(trimmed, res)
  }

  // 16. `${CODE} is waiting for your decision.`
  const waitingDecisionMatch = normalized.match(/^([A-Z0-9-]+)\s+is waiting for your decision\.$/i)
  if (waitingDecisionMatch) {
    const res = `${waitingDecisionMatch[1]} ඔබගේ තීරණය අපේක්ෂාවෙන් පවතී.`
    translationMemoCache.set(cacheKey, res)
    return text.replace(trimmed, res)
  }

  // 17. `${CODE} is awaiting a formal municipal decision.`
  const awaitingDecisionMatch = normalized.match(/^([A-Z0-9-]+)\s+is awaiting a formal municipal decision\.$/i)
  if (awaitingDecisionMatch) {
    const res = `${awaitingDecisionMatch[1]} විධිමත් නගර සභා තීරණයක් අපේක්ෂාවෙන් පවතී.`
    translationMemoCache.set(cacheKey, res)
    return text.replace(trimmed, res)
  }

  // 18. `Your payment of LKR ${AMOUNT} (${REF}) has been received successfully.`
  const taxPaymentMatch = normalized.match(/^Your payment of LKR\s+([\d,.]+)\s+\(([^)]+)\)\s+has been received successfully\.$/i)
  if (taxPaymentMatch) {
    const res = `ඔබගේ LKR ${taxPaymentMatch[1]} (${taxPaymentMatch[2]}) ගෙවීම සාර්ථකව ලැබී ඇත.`
    translationMemoCache.set(cacheKey, res)
    return text.replace(trimmed, res)
  }

  // 19. `Your booking (${CODE}) for ${FACILITY} on ${DATE} has been confirmed.`
  const bookingConfirmMatch = normalized.match(/^Your booking\s+\(([^)]+)\)\s+for\s+(.+)\s+on\s+(.+)\s+has been confirmed\.$/i)
  if (bookingConfirmMatch) {
    const res = `${bookingConfirmMatch[2]} සඳහා ඔබගේ ${bookingConfirmMatch[3]} දින වෙන්කිරීම (${bookingConfirmMatch[1]}) තහවුරු කර ඇත.`
    translationMemoCache.set(cacheKey, res)
    return text.replace(trimmed, res)
  }

  // 20. `Your booking (${CODE}) for ${FACILITY} has been updated to ${STATUS}.`
  const bookingUpdateMatch = normalized.match(/^Your booking\s+\(([^)]+)\)\s+for\s+(.+)\s+has been updated to\s+(.+)\.$/i)
  if (bookingUpdateMatch) {
    const rawStatus = bookingUpdateMatch[3].trim()
    const transStatus = phraseMap[rawStatus] || lowerPhraseMap[rawStatus.toLowerCase()] || rawStatus
    const res = `${bookingUpdateMatch[2]} සඳහා ඔබගේ වෙන්කිරීම (${bookingUpdateMatch[1]}) ${transStatus} ලෙස යාවත්කාලීන කර ඇත.`
    translationMemoCache.set(cacheKey, res)
    return text.replace(trimmed, res)
  }

  // 21. `Approval ${STATUS}`
  const approvalTitleMatch = normalized.match(/^Approval\s+(.+)$/i)
  if (approvalTitleMatch) {
    const rawStatus = approvalTitleMatch[1].trim()
    const transStatus = phraseMap[rawStatus] || lowerPhraseMap[rawStatus.toLowerCase()] || rawStatus
    const res = `අනුමැතිය ${transStatus}`
    translationMemoCache.set(cacheKey, res)
    return text.replace(trimmed, res)
  }

  // 22. `Booking ${STATUS}`
  const bookingTitleMatch = normalized.match(/^Booking\s+(.+)$/i)
  if (bookingTitleMatch) {
    const rawStatus = bookingTitleMatch[1].trim()
    const transStatus = phraseMap[rawStatus] || lowerPhraseMap[rawStatus.toLowerCase()] || rawStatus
    const res = `වෙන්කිරීම ${transStatus}`
    translationMemoCache.set(cacheKey, res)
    return text.replace(trimmed, res)
  }

  // 3. Dynamic patterns that preserve placeholders, user names, or numbers
  const greetingMatch = trimmed.match(/^(Good morning|Good afternoon|Good evening),\s+(.+)\.$/i)
  if (greetingMatch) {
    const namePart = greetingMatch[2]
    const res = `සුබ දහවලක්, ${namePart}.`
    translationMemoCache.set(cacheKey, res)
    return text.replace(trimmed, res)
  }

  const wardPulseMatch = trimmed.match(/^(Ward\s+\d+)\s+pulse$/i)
  if (wardPulseMatch) {
    const res = `${wardPulseMatch[1]} සක්‍රියතාව`
    translationMemoCache.set(cacheKey, res)
    return text.replace(trimmed, res)
  }

  const searchingForMatch = trimmed.match(/^Searching for "(.+)"\.\.\.$/i)
  if (searchingForMatch) {
    const res = `"${searchingForMatch[1]}" සොයමින් පවතී...`
    translationMemoCache.set(cacheKey, res)
    return text.replace(trimmed, res)
  }

  const resultsForMatch = trimmed.match(/^Results for "(.+)"$/i)
  if (resultsForMatch) {
    const res = `"${resultsForMatch[1]}" සඳහා ප්‍රතිඵල`
    translationMemoCache.set(cacheKey, res)
    return text.replace(trimmed, res)
  }

  const buildingsNearMatch = trimmed.match(/^Buildings within 250 m of\s+(.+)$/i)
  if (buildingsNearMatch) {
    const res = `${buildingsNearMatch[1]} සිට මීටර් 250ක් ඇතුළත ගොඩනැගිලි`
    translationMemoCache.set(cacheKey, res)
    return text.replace(trimmed, res)
  }

  const buildingCountMatch = trimmed.match(/^(\d+)\s+buildings?$/i)
  if (buildingCountMatch) {
    const count = buildingCountMatch[1]
    const label = count === '1' ? 'ගොඩනැගිල්ල' : 'ගොඩනැගිලි'
    const res = `${count} ${label}`
    translationMemoCache.set(cacheKey, res)
    return text.replace(trimmed, res)
  }

  if (trimmed.startsWith('LGS / ')) {
    const sub = trimmed.slice(6).trim()
    if (phraseMap[sub]) {
      const res = `LGS / ${phraseMap[sub]}`
      translationMemoCache.set(cacheKey, res)
      return text.replace(trimmed, res)
    }
  }

  translationMemoCache.set(cacheKey, trimmed)
  return text
}
