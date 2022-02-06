/**
 * Today Widget for Übersicht
 * 
 * Version: 1.0
 * Last Updated: 02/06/2022
 * 
 * Created by Bert Bredewold
 */

// Get's WAN IP from a dig to OpenDNS
export const command = 'today.widget/today.sh';

// Refresh every X miliseconds
export const refreshFrequency = 3000;

// Base layout
export const className = {
    bottom: '5px',
    right: '5px',
    color: '#fff',
    fontFamily: 'Cascadia Code',
    fontWeight: 300,
    fontSize: '12px',
    textAlign: 'right'
}

const parseIcalBuddyOutput = input => {
        // Regex for parsing icalbuddy's output.
        const regex = /• (.*?)\n    (.*?)\n(?:    (attendees:.*?)\n)?(?:    (notes:.*?)\n)?/gm;
    
        // Match all
        const matches = input.matchAll(regex);

        // Array for the processed events.
        const events = [];
    
        for (const match of matches) {
            events.push({
                title: match[1],
                datetime: match[2],
                attendees: match[3],
                notes: match[4],
                url: parseMeetingUrlFromNotes(match[4])
            })
        }

        return events.map((event, index) => (
            <div key={index}>
                {event.url} {event.title} ▶ {event.datetime}
            </div>
        ));
};

const parseMeetingUrlFromNotes = notes => {
    const regex = /https:\/\/(?:zoom\.us|meet\.google\.com|teams.microsoft.com)\/.*? /;
    const matchResult = notes.match(regex);
    if (matchResult) {
       return <a style={{textDecoration: 'none'}} href={matchResult}>📞</a>;
    }
};

// Render the widget
export const render = ({output, error}) => {
    const events = parseIcalBuddyOutput(output);

    return error ? (
        <div>Oops: <strong>{String(error)}</strong></div>
    ) : (
        <div>
            {parseIcalBuddyOutput(output)}
        </div>
    );
}