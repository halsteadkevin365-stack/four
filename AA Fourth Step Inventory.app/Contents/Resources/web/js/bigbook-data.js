/**
 * Big Book authentic data, excerpts, glossaries, prayers, and default examples
 * Alcoholics Anonymous, Chapter 5: "How It Works" (pp. 64-71) & Chapter 6: "Into Action" (pp. 72-75)
 */

const BIG_BOOK_DATA = {
  excerpts: {
    inventoryIntro: {
      title: "Fact-Finding and Fact-Facing",
      page: "pp. 64-65",
      quote: "Next we launched on a course of vigorous action, the first step of which is a personal housecleaning, which many of us had never attempted. A business which takes no regular inventory usually goes broke. Taking a commercial inventory is a fact-finding and a fact-facing process. It is an effort to find out the truth about the stock-in-trade. One object is to disclose damaged or unsalable goods, to get rid of them promptly and without regret. We did exactly the same thing with our lives. We had to face and be rid of the things in ourselves which had been directing our lives."
    },
    resentmentIntro: {
      title: "The Number One Offender",
      page: "pp. 64-65",
      quote: "Resentment is the 'number one' offender. It destroys more alcoholics than anything else. From it stem all forms of spiritual disease, for we have been not only mentally and physically ill, we have been spiritually sick. When the spiritual malady is overcome, we straighten out mentally and physically."
    },
    column4Turnaround: {
      title: "Column 4: The Turnaround",
      page: "p. 67",
      quote: "Referring to our list again. Putting out of our minds the wrongs others had done, we resolutely looked for our own mistakes. Where had we been selfish, dishonest, self-seeking and frightened? Though a situation had not been entirely or even partly our fault, we tried to disregard the other person involved entirely. Where were we to blame? The inventory was ours, not the other man's. When we saw our faults we listed them. We placed them before us in black and white."
    },
    resentmentPrayer: {
      title: "The Freedom from Resentment Prayer (Sick Man's Prayer)",
      page: "p. 67",
      quote: "This was our course: We realized that the people who wronged us were perhaps spiritually sick. Though we did not like their symptoms and the way these disturbed us, they, like ourselves, were sick too. We asked God to help us show them the same tolerance, pity, and patience that we would cheerfully grant a sick friend. When a person offended we said to ourselves: 'This is a sick person. How can I be helpful to him? God save me from being angry. Thy will be done.'"
    },
    fourteenDayPrayer: {
      title: "The 14-Day Resentment Freedom Exercise",
      page: "Freedom from Anger Practice",
      quote: "If you have a resentment you want to be free of, pray for the person or the thing that you resent. Ask for everything you want for yourself to be given to them—health, prosperity, happiness, and peace of mind. Do this every day for 14 days, whether you mean it or not. By the 14th day, you will find your anger has lifted."
    },
    fearIntro: {
      title: "Reviewing Our Fears",
      page: "pp. 67-68",
      quote: "We reviewed our fears thoroughly. We put them on paper, even though we had no resentment in connection with them. We asked ourselves why we had them. Wasn't it because self-reliance failed us? Self-reliance was good as far as it went, but it didn't go far enough. Some of us once had great self-confidence, but it didn't fully solve the fear problem, or any other problem. When it made us cocky, it was worse."
    },
    fearPrayer: {
      title: "The Fear Prayer",
      page: "p. 68",
      quote: "We ask Him to remove our fear and direct our attention to what He would have us be. At once, we commence to outgrow fear."
    },
    sexConductIntro: {
      title: "Sex Conduct & Relationships",
      page: "pp. 68-70",
      quote: "Now about sex. Many of us needed an overhauling there. But above all, we tried to be sensible on this subject. It's so easy to get off the track. We subjected each relation to this test: was it selfish or not? We asked God to mold our ideals and help us to live up to them. We remembered always that our sex powers were God-given and therefore good, neither to be used lightly or selfishly nor to be despised and loathed."
    },
    step5Promise: {
      title: "The Promises of Step Five",
      page: "pp. 75",
      quote: "Once we have taken this step, withholding nothing, we are delighted. We can look the world in the eye. We can be alone at perfect peace and ease. Our fears fall from us. We begin to feel the nearness of our Creator. We may have had certain spiritual beliefs, but now we begin to have a spiritual experience. The feeling that the drink problem has disappeared will often come strongly. We feel we are on the Broad Highway, walking hand in hand with the Spirit of the Universe."
    }
  },

  glossary: {
    instincts: [
      {
        id: "self_esteem",
        name: "Self-Esteem",
        description: "What I think of myself; my sense of personal worth, dignity, and inner value.",
        question: "Did this make me feel small, worthless, inferior, or defensive?"
      },
      {
        id: "pride",
        name: "Pride",
        description: "How I want others to think of me; my public reputation, ego, and social standing.",
        question: "Was I worried about what people would think, say, or judge about me?"
      },
      {
        id: "pocketbook",
        name: "Pocketbook (Finances)",
        description: "My material security, livelihood, money, job, or financial stability.",
        question: "Was my ability to make a living, support myself, or acquire material security threatened?"
      },
      {
        id: "security",
        name: "Security",
        description: "My basic emotional, physical, and existential safety in the world.",
        question: "Did I feel unsafe, physically vulnerable, or deeply unsettled about my future?"
      },
      {
        id: "ambitions",
        name: "Ambitions",
        description: "My plans, goals, desires, and demands for how life and others ought to behave.",
        question: "Did this interfere with what I wanted to achieve, acquire, or control?"
      },
      {
        id: "personal_relationships",
        name: "Personal Relationships",
        description: "My ties to family, friends, partners, coworkers, and community.",
        question: "Was a close personal bond damaged, strained, or alienated?"
      },
      {
        id: "sex_relations",
        name: "Sex Relations",
        description: "My intimate, romantic, and sexual relationships and conduct.",
        question: "Did this wound my intimacy, fidelity, romantic trust, or sexual self-image?"
      }
    ],

    defects: [
      {
        id: "selfish",
        name: "Selfish",
        question: "Where was I putting my own desires, comforts, or ego ahead of everyone else?",
        explanation: "Concerned only with self; demanding my own way regardless of how it affects others.",
        oppositeAsset: "Selfless / Generous",
        oppositeDescription: "Considering others first, sharing generously without keeping score, practicing unselfish love."
      },
      {
        id: "dishonest",
        name: "Dishonest",
        question: "What lies, exaggerations, omissions, or delusions did I practice?",
        explanation: "False representations, hiding the truth, pretending to be something I was not, lying to myself or others.",
        oppositeAsset: "Rigorous Honesty / Transparency",
        oppositeDescription: "Speaking truth kindly, being authentic, admitting mistakes promptly, facing reality as it is."
      },
      {
        id: "self_seeking",
        name: "Self-Seeking",
        question: "What was my hidden motive? What was I trying to control or extract?",
        explanation: "Manipulating situations or people to get what I wanted (attention, praise, control, money, emotional rescue).",
        oppositeAsset: "Loving Service / Consideration",
        oppositeDescription: "Approaching situations asking 'How can I be of service?' rather than 'What can I get out of this?'"
      },
      {
        id: "frightened",
        name: "Frightened (Fear)",
        question: "What was I afraid of losing or not getting?",
        explanation: "Fear that I would lose something I possessed, or fail to gain something I desired.",
        oppositeAsset: "Faith / Trust in God",
        oppositeDescription: "Surrendering control to a Higher Power, stepping forward in courage, resting in spiritual security."
      }
    ],

    sexQuestions: [
      { id: "q1", text: "Where had we been selfish?" },
      { id: "q2", text: "Where had we been dishonest?" },
      { id: "q3", text: "Where had we been inconsiderate?" },
      { id: "q4", text: "Whom had we hurt?" },
      { id: "q5", text: "Did we unjustifiably arouse jealousy, suspicion or bitterness?" },
      { id: "q6", text: "Where were we at fault?" },
      { id: "q7", text: "What should we have done instead?" },
      { id: "q8", text: "What is our sound and sane ideal for this relationship or future relations?" },
      { id: "q9", text: "Are we willing to make amends where we caused harm?" }
    ]
  },

  sampleInventory: {
    resentments: [
      {
        id: "sample-res-1",
        target: "Mr. Brown",
        category: "Person",
        cause: "His attention to my wife. Told my wife of my mistress. Brown may get my job at office.",
        affects: ["sex_relations", "self_esteem", "personal_relationships", "pocketbook", "security"],
        selfish: "Wanted to indulge myself with a mistress while demanding my wife stay faithful and blind. Wanted the promotion without merit.",
        dishonest: "Cheating on my wife, living a double life, pretending to be a loyal friend and dedicated employee.",
        selfSeeking: "Wanted admiration and sexual conquest without responsibility; wanted to protect my reputation at all costs.",
        frightened: "Fear of being exposed, losing my marriage, losing my social standing, and losing my livelihood.",
        myPart: "I brought this entire situation upon myself through deceit and infidelity. Brown is merely reflecting back the mess I created.",
        oppositeAsset: "Rigorous honesty with spouse, living an integrated life, treating coworkers with fairness.",
        amendsNeeded: true,
        amendsNotes: "Confess dishonest dealings at office if appropriate; seek marriage counseling or separation amends as guided by sponsor.",
        prayerDaysCompleted: [true, true, true, false, false, false, false, false, false, false, false, false, false, false],
        createdAt: "1939-04-10T10:00:00.000Z"
      },
      {
        id: "sample-res-2",
        target: "Mrs. Jones",
        category: "Person",
        cause: "She is a snob. She snubbed me. She won't let her daughter marry my son.",
        affects: ["self_esteem", "pride", "personal_relationships", "ambitions"],
        selfish: "Demanded that she look up to me and accept my family; wanted to control her opinion and my son's marriage.",
        dishonest: "Pretended I didn't care about high society while secretly desperate for her approval.",
        selfSeeking: "Wanted social elevation and prestige through my son's engagement.",
        frightened: "Fear of being looked down upon as inferior, common, or inadequate.",
        myPart: "Gossiped about her, held silent contempt, judged her harshly before knowing her, meddled in my son's personal life.",
        oppositeAsset: "Acceptance of others without condition, releasing control over adult children, finding worth in God.",
        amendsNeeded: false,
        amendsNotes: "Stop gossiping, treat her with genuine courtesy, release control over son's choices.",
        prayerDaysCompleted: [true, false, false, false, false, false, false, false, false, false, false, false, false, false],
        createdAt: "1939-04-10T10:30:00.000Z"
      },
      {
        id: "sample-res-3",
        target: "My Employer",
        category: "Employer / Workplace",
        cause: "Unreasonable, overbearing, threatens to fire me for drinking and missing work, pays me unfairly.",
        affects: ["pocketbook", "security", "ambitions", "self_esteem"],
        selfish: "Expected full wages, bonuses, and respect while calling in hungover and doing the bare minimum.",
        dishonest: "Faked illness excuses, covered up botched work, blamed coworkers for my delays.",
        selfSeeking: "Wanted maximum reward for minimum effort, playing the victim when held accountable.",
        frightened: "Fear of poverty, losing my home, facing my inability to hold down a job while drinking.",
        myPart: "I was unpunctual, unreliable, resentful, and hungover on the job. His demands were reasonable business expectations.",
        oppositeAsset: "An honest day's labor for an honest day's pay, punctuality, humble willingness to take accountability.",
        amendsNeeded: true,
        amendsNotes: "Put in honest day's work, apologize for unreliability and past missed days, repay unearned compensation if asked.",
        prayerDaysCompleted: [false, false, false, false, false, false, false, false, false, false, false, false, false, false],
        createdAt: "1939-04-10T11:00:00.000Z"
      }
    ],

    fears: [
      {
        id: "sample-fear-1",
        fear: "Financial Ruin / Not Having Enough Money",
        why: "Self-reliance failed me. I believed my security came from money in the bank and my cleverness rather than God.",
        affects: ["pocketbook", "security", "ambitions"],
        selfReliancePart: "Tried to hoard, gamble, or obsess over finances. Failed to trust that if I stay sober and do honest work, my needs are provided for.",
        prayerPractice: "Asked God to remove this fear and show me how to be of service today rather than obsessing over tomorrow.",
        createdAt: "1939-04-10T11:30:00.000Z"
      },
      {
        id: "sample-fear-2",
        fear: "Rejection / People Finding Out What I'm Really Like",
        why: "Self-reliance failed. I made other people's approval my Higher Power. Without their praise, I felt empty.",
        affects: ["self_esteem", "pride", "personal_relationships"],
        selfReliancePart: "Wearing a mask, people-pleasing, lying to sound impressive, hiding weaknesses.",
        prayerPractice: "We ask Him to remove our fear and direct our attention to what He would have us be: honest, humble, and useful.",
        createdAt: "1939-04-10T11:45:00.000Z"
      }
    ],

    sexConduct: [
      {
        id: "sample-sex-1",
        person: "Former Partner (Sarah)",
        selfish: "Used the relationship purely for validation, comfort, and physical pleasure while emotionally unavailable.",
        dishonest: "Made false promises of commitment when I had no intention of settling down.",
        inconsiderate: "Disappeared for days on benders, ignored her calls, broke dinner dates, blamed her for my mood.",
        hurt: "Inflicted deep emotional distress, undermined her self-worth and trust in men.",
        jealousy: "Flirted openly with others at parties to make her insecure and keep the upper hand.",
        whereAtFault: "Self-centered manipulation from beginning to end; never treated her as a human being with feelings.",
        whatShouldHaveDone: "Been completely honest about my intentions, treated her with kindness, broken it off cleanly.",
        soundSaneIdeal: "An honest, faithful, communicative partnership based on mutual respect, spiritual growth, and unselfish care.",
        willingAmends: "Yes, willing to make living amends and direct amends if sponsor advises it won't reopen old wounds.",
        createdAt: "1939-04-10T12:00:00.000Z"
      }
    ],

    harms: [
      {
        id: "sample-harm-1",
        person: "My Brother",
        description: "Borrowed $800 promising to pay it back within a month; avoided his calls for two years and made derogatory comments about him to family to justify my debt.",
        financialHarm: true,
        financialAmount: "$800.00",
        emotionalHarm: true,
        restitutionPlan: "Set up monthly repayment plan of $100/mo; apologize for the lying and avoidance.",
        willingness: "Willing",
        createdAt: "1939-04-10T12:30:00.000Z"
      },
      {
        id: "sample-harm-2",
        person: "Neighbor (Mr. Clark)",
        description: "Backed into his driveway stone wall while driving under the influence; drove off without leaving a note.",
        financialHarm: true,
        financialAmount: "Cost of masonry repair (~$450)",
        emotionalHarm: false,
        restitutionPlan: "Approach him, confess, apologize for cowardice, pay full repair cost.",
        willingness: "Willing",
        createdAt: "1939-04-10T12:45:00.000Z"
      }
    ]
  }
};
