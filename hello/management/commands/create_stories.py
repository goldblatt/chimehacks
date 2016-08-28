from django.core.management.base import BaseCommand
from hello.models import *

import random

class Command(BaseCommand):
    def handle(self, *args, **options):
        GENDER_CONSTANTS = [
            ("cis-woman","cis-woman") , 
            ("cis-man","cis-man"), 
            ("non-binary", "non-binary"),
            ("trans-woman", "trans-woman"),
            ("trans-man", "trans-man"), 
            ("other","other"), 
            ("do not wish to disclose", "do not wish to disclose")
        ]
        ASSAILANT_CONSTANTS = [
            ("romantic partner", "romantic partner"), 
            ("friend", "friend"),
            ("teacher", "teacher"),  
            ("boss", "boss"),  
            ("family member", "family member"),  
            ("stranger", "stranger"), 
            ("police officer", "police officer"), 
            ("do not wish to disclose", "do not wish to disclose") 
        ]
        TYPE_OF_ABUSE_CONSTANTS = [
            ("rape", "rape"), 
            ("controlling behaviour", "controlling behaviour"),  
            ("partner assault", "partner assault"), 
            ("stalking", "stalking"),  
            ("indecent exposure", "indecent exposure"), 
            ("pornography", "pornography"), 
            ("cyber bullying", "cyber bullying"),  
            ("genital mutilation", "genital mutilation"), 
            ("threats of physical violence", "threats of physical violence"), 
            ("incest", "incest")
        ]
        LOCATION_CONSTANTS = [
            ("in a public space", "in a public space"), 
            ("on a college campus", "on a college campus"),  
            ("at or near home", "at or near your home"), 
            ("at or near a relative's home", "at or near a relative's home") 
        ]

        REPORTED_CONSTANTS = [
            ("yes", "yes"), 
            ("no", "no"), 
            ("do not wish to disclose", "do not wish to disclose")
        ]

        cities = {
                'NYC': {'lat': '40.555', 'lng': '-74.159'},
                'SF': {'lat': '37.778305', 'lng': '-122.416145'},
                'Sao Paolo': {'lat': '-23.577734', 'lng': '-46.625549'},
                'Nairobi': {'lat': '-1.292021', 'lng': '36.806476'},
                'Beijing': {'lat': '39.913992', 'lng': '116.389003'},
                'New Delhi': {'lat': '28.597453', 'lng': '77.221997'},
                'London': {'lat': '51.431817', 'lng': '-0.070920'}
            }

        STORIES = [
            "", 
            "My story began almost 30 years ago during an overnight at my best friends' "
            + "camp on one of the Finger Lakes in Central New York. I was 19 years old and with 10 friends "
            + "I had known most of my life. I rode to the camp with my best friend and her husband, who was in the Navy. "
            + "They now lived out of town but were here while he was home on leave. When we got to the camp, my best friend "
            + "told me I could have the best bedroom upstairs, since everyone else was sleeping on the floor. Excited, I put "
            + "my belongings in the upstairs room and changed into my suit for a warm day on the boat. After being on the "
            + "lake all day, I was the first to go to bed. I awoke to the force of my best friends' husband's hand over my mouth"
            + "while he held me down with the other. He was a big guy and I was frozen with fear and intimidation - I absolutely"
            + " could not move a muscle. His buddy, another guy I had known all my life, was now on top of me also holding me down "
            + "and grabbing at my underwear. It was the middle of the night; I was half asleep and thought I must be dreaming. "
            + "Soon, it became evident I was not dreaming. It was real, but psychologically - it didn't make any sense. "
            + "Where was everyone? Where was my best friend? Why were these guys - my friends - doing this to me? It was all over"
            + " quickly and they left immediately with my best friends' husband warning me not to say a word. I was definitely afraid of him."
            + " I was raised a strict Catholic and immediately thoughts of fear, shame and disgust filled my head. I began to think this was all"
            + " my fault, I thought I must have done something to encourage this. And then it hit me: Was it really an attack because I knew them?"
            + " Was it actually rape since they were my friends? My head was spinning and I was physically sick to my stomach."
            + " The next morning, still terrified, I went downstairs and saw my attackers in the kitchen. I didn't know what to think or say."
            + " My best friends' husband just stared at me. My best friend appeared to be acting normal. 'She'll never believe you', I told myself."
            + " 'This is her husband, she loves him.' Silently, I packed my things and rode the whole way home in the car with my rapist. "
            + " And I never said a word. I immediately blamed myself and thought if I had only slept downstairs with everyone else, it wouldn't "
            + "have happened. My mind could not comprehend this whole scenario, so in order to cope with it; I blocked it out as if it never happened."
            + " I shut down completely and decided I would never tell anyone about it."
            + " A few months later I realized the nightmare wasn't over. I had become pregnant from the rape. I went into shock again."
            + " Being a strict Catholic, I thought how could God allow this to happen to me? I was convinced I was being punished for sure."
            + " I felt enormous shame and guilt. This was 30 years ago. Practically no one went to counseling then or openly sought help for "
            + "such things. I could not tell my mother, and I was too ashamed to tell my friends. And who would believe me now two months later ..."
            + " I still could not believe it. Because of my shame, fear, disgust and the belief I had no one to turn to, I regretfully made the decision "
            + "to terminate the pregnancy."
            + "The Rape and then the trauma of the subsequent choices I had to make as a result of being raped haunted me for years. "
            + "I found with the Rape that my body healed, but my thought process and inner core were deeply damaged. Because I blamed myself, "
            + "I hated myself. I became a severe alcoholic, bill collectors called me non-stop, my relationships with men were abusive, I was "
            + "terrified to sleep alone at night, had violent nightmares and finally resorted to sleeping with a baseball bat, a butcher knife "
            + "and the cordless phone because of the fear it would happen again. This act that had ended years and years ago, continued to torture me"
            + "every minute of every day of my life."
            + "It wasn't until I was married and then became pregnant that I decided to get sober and started counseling."
            + "I was 31 years old, and it had been 12 years since I was raped. In my first session, I ran to the window and tried to physically open"
            + "it because I felt like all the oxygen had left the room. I truly could not breathe. I stayed with it, but the pain of uncovering these"
            + "old wounds was mentally and emotionally traumatizing. Because I stopped using alcohol to soothe the pain, I chose food as a new addiction."
            + " My weight fluctuated constantly until at one point, I stopped eating altogether."
            + "That's how psychologically devastating rape can be. You disappear. Your body is your canvas, the picture you show to the world. "
            + "And if someone has violated your personal canvas, you believe you can't possibly remove this poison that now permeates every crevice of your mind,"
            + " body and soul. You become disconnected from your body in order to survive and are convinced that you have been altered and changed forever."
            + " Nothing will ever erase the ugliness left behind.", 
            "I was molested by my middle school teacher. My teacher lured me into a false sense of trust and ultimate betrayal. " +
            "I endured ten years of control, manipulation and abuse at the hands of a person who was admired by his students, peers, " + 
            "administrators and community. No child should have their innocence stolen. By sharing my story, I have the ability to give a" +
            " clear picture of how the prevalent epidemic of educator sexual abuse begins, progresses, and affects so many innocent lives. " +
            "I want to shed light on the dynamics of educator sexual abuse so schools can be safe havens for every child.", 
            "On January 17th, 2015, it was a quiet Saturday night at home. My dad made some dinner and I sat at the table with my younger sister " + 
            "who was visiting for the weekend. I was working full time and it was approaching my bed time. I planned to stay at home by myself, " + 
            "watch some TV and read, while she went to a party with her friends. Then, I decided it was my only night with her, I had nothing better " + 
            " to do, so why not, there's a dumb party ten minutes from my house, I would go, dance like a fool, and embarrass my younger sister. " + 
            "On the way there, I joked that undergrad guys would have braces. My sister teased me for wearing a beige cardigan to a frat party like a " +
            "librarian. I called myself 'big mama', because I knew I'd be the oldest one there. I made silly faces, let my guard down, and drank liquor " + 
            "too fast not factoring in that my tolerance had significantly lowered since college. The next thing I remember I was in a gurney in a " + 
            "hallway. I had dried blood and bandages on the backs of my hands and elbow. I thought maybe I had fallen and was in an admin office on " + 
            "campus. I was very calm and wondering where my sister was. A deputy explained I had been assaulted. I still remained calm, assured he was " + 
            "speaking to the wrong person. I knew no one at this party. When I was finally allowed to use the restroom, I pulled down the hospital pants " + 
            "they had given me, went to pull down my underwear, and felt nothing. I still remember the feeling of my hands touching my skin and grabbing " + 
            "nothing. I looked down and there was nothing. The thin piece of fabric, the only thing between my vagina and anything else, was missing and " + 
            "everything inside me was silenced. I still don't have words for that feeling. In order to keep breathing, I thought maybe the policemen used" + 
            "scissors to cut them off for evidence. Then, I felt pine needles scratching the back of my neck and started pulling them out my hair. " +
            "I thought maybe, the pine needles had fallen from a tree onto my head. My brain was talking my gut into not collapsing. Because my gut was saying,"
            + " help me, help me." + 
"I shuffled from room to room with a blanket wrapped around me, pine needles trailing behind me, I left a little pile in every room I sat in. " +
"I was asked to sign papers that said 'Rape Victim' and I thought something has really happened. My clothes were confiscated and I stood naked while " + 
"the nurses held a ruler to various abrasions on my body and photographed them. The three of us worked to comb the pine needles out of my hair, six hands" + 
"to fill one paper bag. To calm me down, they said it's just the flora and fauna, flora and fauna. I had multiple swabs inserted into my vagina and anus," + 
" needles for shots, pills, had a Nikon pointed right into my spread legs. I had long, pointed beaks inside me and had my vagina smeared with cold, blue" + 
" paint to check for abrasions. After a few hours of this, they let me shower. I stood there examining my body beneath the stream of water and decided, " +
"I don't want my body anymore. I was terrified of it, I didn't know what had been in it, if it had been contaminated, who had touched it. I wanted to " + 
"take off my body like a jacket and leave it at the hospital with everything else." +
"On that morning, all that I was told was that I had been found behind a dumpster, potentially penetrated by a stranger, and that I should get retested for HIV because results don't always show up immediately. But for now, I should go home and get back to my normal life. Imagine stepping back into the world with only that information. They gave me huge hugs and I walked out of the hospital into the parking lot wearing the new sweatshirt and sweatpants they provided me, as they had only allowed me to keep my necklace and shoes."
+"My sister picked me up, face wet from tears and contorted in anguish. Instinctively and immediately, I wanted to take away her pain. I smiled at her, I told her to look at me, I'm right here, I'm okay, everything's okay, I'm right here. My hair is washed and clean, they gave me the strangest shampoo, calm down, and look at me. Look at these funny new sweatpants and sweatshirt, I look like a P.E. teacher, let's go home, let's eat something. She did not know that beneath my sweatsuit, I had scratches and bandages on my skin, my vagina was sore and had become a strange, dark color from all the prodding, my underwear was missing, and I felt too empty to continue to speak. That I was also afraid, that I was also devastated. That day we drove home and for hours in silence my younger sister held me."
+"My boyfriend did not know what happened, but called that day and said, 'I was really worried about you last night, you scared me, did you make it home okay?' I was horrified. That's when I learned I had called him that night in my blackout, left an incomprehensible voicemail, that we had also spoken on the phone, but I was slurring so heavily he was scared for me, that he repeatedly told me to go find [my sister]. Again, he asked me, 'What happened last night? Did you make it home okay?' I said yes, and hung up to cry."
+"I was not ready to tell my boyfriend or parents that actually, I may have been raped behind a dumpster, but I don't know by who or when or how. If I told them, I would see the fear on their faces, and mine would multiply by tenfold, so instead I pretended the whole thing wasn't real."
+"I tried to push it out of my mind, but it was so heavy I didn't talk, I didn't eat, I didn't sleep, I didn't interact with anyone. After work, I would drive to a secluded place to scream. I didn't talk, I didn't eat, I didn't sleep, I didn't interact with anyone, and I became isolated from the ones I loved most. For over a week after the incident, I didn't get any calls or updates about that night or what happened to me. The only symbol that proved that it hadn't just been a bad dream, was the sweatshirt from the hospital in my drawer."
+"One day, I was at work, scrolling through the news on my phone, and came across an article. "
+ "In it, I read and learned for the first time about how I was found unconscious, with my hair disheveled, " +
"long necklace wrapped around my neck, bra pulled out of my dress, dress pulled off over my shoulders and pulled up above my waist, " + 
"that I was butt naked all the way down to my boots, legs spread apart, and had been penetrated by a foreign object by someone I did not " +
"recognize. This was how I learned what happened to me, sitting at my desk reading the news at work. I learned what happened to me the same " +
"time everyone else in the world learned what happened to me. That's when the pine needles in my hair made sense, they didn't fall from a tree. " +
"He had taken off my underwear, his fingers had been inside of me. I don't even know this person. I still don't know this person. When I read " + 
"about me like this, I said, this can't be me, this can't be me. I could not digest or accept any of this information. I could not imagine my " + 
"family having to read about this online. I kept reading. In the next paragraph, I read something that I will never forgive; I read that according to him, I liked it. I liked it. Again, I do not have words for these feelings."]
        for i in range(0, 200): 
            random_city = random.randint(0, len(cities.keys())-1)
            random_gender =random.randint(0, len(GENDER_CONSTANTS) - 1) 
            random_assailant = random.randint(0, len(ASSAILANT_CONSTANTS) - 1)
            random_type = random.randint(0, len(TYPE_OF_ABUSE_CONSTANTS) -1)
            random_location = random.randint(0, len(LOCATION_CONSTANTS) - 1)
            random_report = random.randint(0, len(REPORTED_CONSTANTS) - 1)
            random_Story = random.randint(0, len(STORIES) - 1)

            story = Stories.objects.create( 
                lng = cities[cities.keys()[random_city]]['lng'],
                lat = cities[cities.keys()[random_city]]['lat'],
                gender = GENDER_CONSTANTS[random_gender][0],
                assailant = ASSAILANT_CONSTANTS[random_assailant][0],
                type_of_abuse = TYPE_OF_ABUSE_CONSTANTS[random_type][0],
                report = REPORTED_CONSTANTS[random_report][0],
                story = STORIES[random_Story],
                permission = False
            )
            print "created story: " + str(i) + " story" + str(story.id)